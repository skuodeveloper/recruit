<template>
  <div class="panel-complete" >
    <div class="recruit-header van-hairline--bottom">
      <van-row>
        <van-col span="24" style="text-align: center">
          <div class="recruit-title"><span>{{recruitDetail.title}}</span></div>
        </van-col>
      </van-row>
      <div style="margin-top: 10px">
        <van-row>
          <van-col span="7" offset="0">
            <div class="van-ellipsis recruit-title-name">
              <img src="../../../../static/images/mine/mine-time.png" style="height: 15px;width: 15px;"/>
              <span class="recruit-header-son">{{recruitDetail.create_time}}</span>
            </div>
          </van-col>
          <van-col span="4">
            <div class="van-ellipsis recruit-title-name">
              <img src="../../../../static/images/mine/mine-liulang.png" style="height: 15px;width: 15px;"/>
              <span class="recruit-header-son">{{recruitDetail.view}}</span>
            </div>
          </van-col>
          <van-col span="4">
            <div class="van-ellipsis recruit-title-name">
              <img src="../../../../static/images/mine/mine-fankui.png" style="height: 15px;width: 15px;"/>
              <span class="recruit-header-son">{{comments.length}}</span>
            </div>
          </van-col>
          <van-col span="4" v-if="userInfo.type === 2">
            <div class="van-ellipsis recruit-title-name">
              <img src="../../../../static/images/headline/headline-id.png" style="height: 15px;width: 15px;"/>
              <span class="recruit-header-son">{{id}}</span>
            </div>
          </van-col>
          <van-col span="5" v-if="userInfo.type === 2">
            <div class="van-ellipsis recruit-title-name">
              <img src="../../../../static/images/mine/mine-user.png" style="height: 15px;width: 15px;"/>
              <span class="recruit-header-son" style="font: bold" @click="toMemberDetail(recruitDetail.publisher_id)">{{recruitDetail.publisherName}}</span>
            </div>
          </van-col>
        </van-row>
      </div>
    </div>
    <div class="van-hairline--bottom data-panel">
      <div class="recruit-content">
        <div v-if="isRecruitLoading" style="width: 100%;height: 500px;padding-top: 200rpx;text-align: center">
          <van-loading size="50px" color="#1c86ee" />
        </div>
        <wxParse :content="recruitDetail.content" :loading="isRecruitLoading"/>
      </div>
    </div>
    <div v-if="userInfo.type === 0" class="van-hairline--bottom data-panel" style="padding-bottom: 10px">
      <div style="height: 150px;padding: 5px 15px 15px 35px">
        <textarea v-model="comment" style="font-size: 14px;border:solid 1px #f8f8f8" rows="4" cols="50" placeholder="说点什么吧...">
        </textarea>
      </div>
      <div style="text-align: center"><van-button type="info" size="normal" @click="addComment">&nbsp;&nbsp;评论&nbsp;</van-button></div>
    </div>
    <div class="data-panel" style="padding-bottom: 10px">
      <van-panel>
        <div :class="userInfo.id === item.userId ? 'recruit-user-common-self van-hairline--bottom' : 'recruit-user-common van-hairline--bottom'" v-for="(item, index) in comments" :key="index">
          <van-row>
            <van-col span="2" offset="1">
              <img class="recruit-user-img" :src="item.avatarUrl === null ? default_img : item.avatarUrl">
            </van-col>
            <van-col span="16">
              <div class="recruit-user-name">{{item.userName}}</div>
              <div class="recruit-comment-before" v-if="item.isTop">
                <div class="recruit-comment-before-content">
                  置顶
                </div>
              </div>
            </van-col>
            <van-col span="4" @click="good(item)">
              <div class="recruit-comment-good">
                <img :src="item.isGooded ? goodedImg : goodImg" />
                <span>{{item.good}}</span>
              </div>
            </van-col>
          </van-row>
          <van-row>
            <van-col span="20" offset="3">
              <div class="recruit-common-content">
                <span>{{item.content}}</span>
              </div>
            </van-col>
          </van-row>
          <div style="margin-top: 10px">
            <van-row v-if="item.reply">
              <van-col span="20" offset="3">
                <div>
                  <div class="before-title-blue"></div>
                  <div class="panel-title" style="font-size: 12px">HR回复</div>
                </div>
              </van-col>
            </van-row>
          </div>
          <van-row v-if="item.reply">
            <van-col span="20" offset="3">
              <div class="recruit-common-content">
                <span>{{item.reply}}</span>
              </div>
            </van-col>
          </van-row>
          <!--&lt;!&ndash;<van-row v-if="userInfo.type !== 0 && recruitDetail.publisher_id === userInfo.id">&ndash;&gt;管理员也应该可以管理咨询页面的评论-->
          <van-row v-if="(userInfo.type === 1 && recruitDetail.publisher_id === userInfo.id) || userInfo.type === 2">
            <van-col v-if="!item.isTop" span="2" offset="16">
              <div class="recruit-common-content">
                <span class="blue-text" @click="setCommentTop(item.id, item.isTop)">置顶</span>
              </div>
            </van-col>
            <van-col v-if="item.isTop" span="4" offset="14">
              <div class="recruit-common-content">
                <span class="blue-text" @click="setCommentTop(item.id, item.isTop)">取消置顶</span>
              </div>
            </van-col>
            <van-col span="2" offset="1" @click="replyComment(item.id, item.reply)">
              <div class="recruit-common-content">
                <span class="blue-text">回复</span>
              </div>
            </van-col>
            <van-col span="2" offset="1">
              <div class="recruit-common-content">
                <span class="blue-text" @click="deleteComment(item.id)">删除</span>
              </div>
            </van-col>
          </van-row>
        </div>
        <van-dialog
          use-slot
          :show="replyShow"
          show-cancel-button
          @cancel="replyCancle"
          @confirm="replyConfirm"
        >
          <van-field
            :value="replyWord"
            label="回复"
            placeholder="请回复"
            @change="replyTextChange"
          />
        </van-dialog>
        <div class="van-hairline--bottom" v-if="userInfo.type === 0">
          <van-row>
            <van-col span="24">
              <div class="normal-rol" @click="recruitMoreHandler(1)">
                <span>留下你的精彩评论吧~</span>
              </div>
            </van-col>
          </van-row>
        </div>
        <div class="recruit-collect" v-if="userInfo.type === 0" @click="collect">
          <div style="margin: auto;">
            <van-icon v-if="!isUserCollection" name="star-o" color="#1c85ee"/>
            <van-icon v-if="isUserCollection" name="star" color="#1c85ee"/>
            <div style="font-size: 10px">{{isUserCollection ? '取消收藏' : '收藏'}}</div>
          </div>
        </div>
      </van-panel>
    </div>
    <van-toast id="van-toast" />
    <van-dialog id="van-dialog" />
  </div>
</template>

<script>
  import wxParse from 'mpvue-wxparse'
  import marked from 'marked'
  import {formateDate} from '../../../utils/index'
  import {navigateTo} from '../../../../../recruit/src/utils/wxApiPack.js'
  import Toast from '../../../../static/vant-weapp/dist/toast/toast'
  import Dialog from '../../../../static/vant-weapp/dist/dialog/dialog'
  export default {
    components: {
      wxParse
    },
    data () {
      return {
        userInfo: {},
        isRecruitLoading: true,
        id: '',
        replyShow: false,
        replyWord: '',
        temp_id: null,
        recruitDetail: null,
        comments: [],
        goodedImg: require('../../../../static/images/recruit/recruit-gooed.png'),
        goodImg: require('../../../../static/images/recruit/recruit-good.png'),
        comment: '',
        isUserCollection: false,
        default_img: require('../../../../static/images/mine/default-headimg.png')
      }
    },
    mounted () {
    },
    onShow () {
      this.id = this.$root.$mp.query.id
      const this_ = this
      this_.getRecruitDetail()
      this_.getRecruitComment()
      if (this.global.type === 0) {
        this_.isUserCollect()
      }
      this.commonInit()
      this.isRecruitLoading = true
      this.recruitDetail = {}
      this.comments = []
      console.log('pub')
      console.log(this.recruitDetail.publisher_id)
      console.log(this.userInfo.id)
    },
    methods: {
      toMemberDetail (id) {
        const this_ = this
        const requestUrl = '/api/index/getUserInfo'
        const params = {
          'id': id
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          if (res.data.code === 0) {
            console.log(res.data.data)
            navigateTo('../../member/main?user=' + JSON.stringify(res.data.data))
          }
        })
      },
      replyTextChange (e) {
        this.replyWord = e.mp.detail
      },
      setCommentTop (id, isTop) {
        var word = isTop ? '取消' : ''
        Dialog.confirm({
          message: '确定' + word + '置顶评论吗？'
        }).then(() => {
          const this_ = this
          const requestUrl = '/api/recruit/setCommentTop'
          const params = {
            'id': id,
            'isTop': isTop ? 1 : 0
          }
          this_.$http.get(requestUrl, params).then(function (res) {
            if (res.data.code === 0) {
              Toast.success(word + '评论置顶成功')
              this_.comments = []
              this_.replyShow = false
              this_.getRecruitComment()
            } else {
              Toast.fail(word + '评论置顶失败')
            }
          })
        })
      },
      deleteComment (id) {
        Dialog.confirm({
          message: '确定删除评论吗？'
        }).then(() => {
          const this_ = this
          const requestUrl = '/api/mine/admin/deleteRecruitComment'
          const params = {
            'id': id
          }
          this_.$http.get(requestUrl, params).then(function (res) {
            if (res.data.code === 0) {
              Toast.success('评论删除成功')
              this_.comments = []
              this_.replyShow = false
              this_.getRecruitComment()
            } else {
              Toast.fail('评论删除失败')
            }
          })
        })
      },
      replyComment (id, reply) {
        console.log(reply)
        if (reply === null) {
          this.replyShow = true
          this.temp_id = id
          this.replyWord = ''
          return
        }
        Toast.fail('回复过了哦~')
      },
      replyConfirm () {
        const this_ = this
        const requestUrl = '/api/recruit/replyComment'
        const params = {
          'id': this.temp_id,
          'reply': this.replyWord
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          if (res.data.code === 0) {
            this_.comments = []
            this_.replyShow = false
            this_.getRecruitComment()
            Toast.success('回复成功')
          } else {
            Toast.fail('回复失败')
          }
        })
      },
      replyCancle () {
        this.replyShow = false
        this.replyWord = ''
      },
      commonInit () {
        this.userInfo.id = this.global.id
        this.userInfo.name = this.global.name
        this.userInfo.avatarUrl = this.global.avatarUrl
        this.userInfo.gender = this.global.gender
        this.userInfo.type = this.global.type
      },
      addComment () {
        if (this.comment === undefined || this.comment.length === 0) {
          Toast.fail('评论内容不能为空哦~')
          return
        }
        if (this.comment.length > 100) {
          Toast.fail('评论不能超过100字哦~')
          return
        }
        const this_ = this
        const requestUrl = '/api/recruit/addComment'
        const params = {
          'recruitId': this.id,
          'userid': this.global.id,
          'content': this.comment
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          if (res.data.code === 0) {
            this_.comment = ''
            this_.comments = []
            this_.getRecruitComment()
            // let temp = {}
            // temp.avatarUrl = this_.global.baseUrl + this_.global.avatarUrl
            // temp.content = this_.comment
            // temp.good = 0
            // temp.isTop = false
            // temp.userName = this_.global.name
            // this_.comments.push(temp)
            Toast.success(res.data.data)
          } else {
            Toast.fail('评论失败')
          }
        })
      },
      isUserCollect () {
        const this_ = this
        const requestUrl = '/api/recruit/isUserCollect'
        const params = {
          'recruit_id': this.id,
          'user_id': this.global.id
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          this_.isUserCollection = res.data.data
        })
      },
      collect () {
        const this_ = this
        var appendUrl = ''
        if (this.isUserCollection) {
          appendUrl = 'notCollect'
        } else {
          appendUrl = 'collect'
        }
        const requestUrl = '/api/recruit/' + appendUrl
        const params = {
          'recruit_id': this.id,
          'user_id': this.global.id
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          if (res.data.code === 0) {
            if (!this_.isUserCollection) {
              Toast.success('资讯收藏成功')
              this_.isUserCollection = true
            } else {
              Toast.success('取消收藏成功')
              this_.isUserCollection = false
            }
            return
          }
          Toast.fail('资讯收藏操作失败')
        })
      },
      getRecruitDetail () {
        const this_ = this
        const requestUrl = '/api/index/getRecruitDetail'
        const params = {
          'id': this.id,
          'userid': this.global.id
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          this_.recruitDetail = res.data.data
          this_.recruitDetail.create_time = formateDate(this_.recruitDetail.create_time, 'yyyy-MM-dd')
          this_.recruitDetail.content = marked(this_.recruitDetail.content)
          this_.isRecruitLoading = false
        })
      },
      getRecruitComment () {
        if (this.global.id === null || this.global.id === undefined) {
          return
        }
        const this_ = this
        const requestUrl = '/api/recruit/getRecruitComment'
        const params = {
          'id': this.id,
          'userid': this.global.id
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          this_.comments = res.data.data
          for (var i = 0; i < this_.comments.length; i++) {
            this_.comments[i].avatarUrl = this_.comments[i].avatarUrl === null || this_.comments[i].avatarUrl === '' ? null : this_.global.baseUrl + this_.comments[i].avatarUrl
            if (this_.comments[i].isGooded === null) {
              this_.comments[i].isGooded = false
            }
          }
        })
      },
      good (item) {
        if (this.userInfo.type !== 0) {
          Toast('用户才能点赞哦~')
          return
        }
        if (item.id === undefined) {
          Toast.fail('稍后再点赞哦~')
          return
        }
        if (item.isGooded) {
          Toast.fail('已经点赞啦~')
          return
        }
        const this_ = this
        const requestUrl = '/api/recruit/goodComment'
        const params = {
          'recruitId': this.id,
          'userid': this.global.id,
          'commentId': item.id
        }
        this_.$http.get(requestUrl, params).then(function (res) {
          if (res.data.code === 0) {
            Toast.success(res.data.data)
          }
        })
        item.isGooded = true
        item.good = item.good + 1
      }
    }
  }
</script>

<style>
  @import url("~mpvue-wxparse/src/wxParse.css");
  page {
    background-color: #f8f8f8;
    height: 100%;
    width: 100%;
    overflow-x:hidden;
  }
  .panel-complete {
    margin-top: 10rpx;
  }
  .data-panel {
    width: 100%;
    margin-top: 20rpx;
    background-color: #ffffff;
  }
  .recruit-header {
    background-color: #ffffff;
    padding: 10rpx 0rpx 20rpx 0rpx;
  }
  .recruit-title {
    width: 100%;
    font-size: 16px;
    font: bold;
    text-align: center;
  }
  .recruit-content {
    padding: 10rpx 30rpx 10rpx 30rpx;
  }
  .recruit-header-son {
    font-size: 12px;
    margin-left: 5px;
    color: #8f8f8f
  }
  .recruit-title-name {
    justify-content: center;
    display: inline-block;
    width: 90%;
    vertical-align: middle;
  }
  .recruit-user-img {
    display: inline-block;
    border-radius: 10rpx;
    width: 40rpx;
    height: 40rpx;
  }
  .recruit-user-name {
    float: left;
    color: #8f8f8f;
    font-size: 12px
  }
  .recruit-comment-before {
    float: left;
    margin-left: 5px;
  }
  .recruit-comment-before-content {
    width: 30px;
    height: 20px;
    border-radius: 3px;
    text-align: center;
    vertical-align: middle;
    line-height: 20px;
    background-color: #8f8f8f;
    color: #ffffff;
    font-size: 11px;
  }
  .recruit-user-common {
    padding-top: 20px;
    padding-bottom: 5px;
    margin-top: 5px;
  }
  .recruit-user-common-self {
    padding-top: 20px;
    padding-bottom: 5px;
    background-color: #fffbd5;
    border-radius: 10px;
    overflow: hidden;
  }
  .recruit-comment-good {
    float: right;
    font-size: 12px;
    color: #8f8f8f;
  }
  .recruit-comment-good img{
    display: inline-block;
    width: 30rpx;
    height: 30rpx;
  }
  .recruit-comment-good span {
    margin-left: 5px;
  }
  .recruit-common-content {
    float: left;
  }
  .before-title-blue {
    width: 5px;
    height: 16px;
    background-color: #1c85ee;
    border-radius: 5px;
    float: left;
    margin-left:0rpx;
  }
  .panel-title {
    float: left;
    margin-left:10rpx;
  }
  .recruit-common-content span {
    font-size: 12px;
  }
  .normal-rol {
    width: 100%;
    height: 75rpx;
    font-size: 14px;
    text-align: center;
    align-items: center;
    vertical-align: center;
    padding-top: 38rpx;
  }
  .recruit-collect {
    display: flex;
    font-size: 20px;
    right: 25px;
    bottom: 60px;
    z-index: 110;
    position: fixed;
    width: 60px;
    text-align: center;
    justify-content: center;
    height: 60px;
    background-color:#ccc;
    border-radius: 50%;
    -moz-border-radius: 50%;
    -webkit-border-radius: 50%;
  }
</style>
