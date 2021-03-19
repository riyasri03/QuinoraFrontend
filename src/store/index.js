import Vue from 'vue'
import Vuex from 'vuex'
import axios from 'axios'
import router from '../router'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    username: '',
    questionAnswerData: [],
    allQuestions: [],
    particularQuestion: {},
    categoryList: [],
    searchByQuestionList: [],
    searchByUserList: [],
    questionImages: [],
    userDetails: {},
    questionListForUser: [],
    /*
    currentUserDetails: {username: 'M', firstName: 's', lastName: 'd', state: 'j', city: 'k', country: 'i', employment: [{position: 'd', organization: 's', startYear: 'j', endYear: 'p'}], education: [{school: 'h', primaryDetail: 'j', startYear: 'g', degree: 'd'}]}
    */
    currentUserDetails: {}
  },
  getters: {
    getCurrentUserDetails (state) {
      return state.currentUserDetails
    },
    getQuestionListForUser (state) {
      return state.questionListForUser
    },
    getUserDetails (state) {
      return state.userDetails
    },
    getQuestionImages (state) {
      return state.questionImages
    },
    getQuestionAnswerData (state) {
      return state.questionAnswerData
    },
    getAllQuestions (state) {
      return state.allQuestions
    },
    getParticularQuestion (state) {
      return state.particularQuestion
    },
    getCategoryList (state) {
      return state.categoryList
    },
    getSearchByQuestionList (state) {
      return state.searchByQuestionList
    },
    getSearchByUserList (state) {
      return state.searchByUserList
    }
  },
  mutations: {
    setCurrentUserDetails (state, value) {
      state.currentUserDetails = value
    },
    setQuestionListForUser (state, value) {
      state.questionListForUser = value
    },
    setUserDetails (state, value) {
      state.userDetails = value
    },
    setQuestionImages (state, value) {
      state.questionImages = value
    },
    setQuestionAnswerData (state, value) {
      state.questionAnswerData = value
    },
    setAllQuestions (state, value) {
      state.allQuestions = value
    },
    setParticularQuestion (state, value) {
      state.particularQuestion = value
    },
    setCategoryList (state, value) {
      state.categoryList = value
    },
    setSearchByQuestionList (state, value) {
      state.searchByQuestionList = value
    },
    setSearchByUserList (state, value) {
      state.searchByUserList = value
    }
  },
  actions: {
    setQuestionListForUserAction ({ commit, state }, value) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/question/all/${localStorage.getItem('username')}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          commit('setQuestionListForUser', e.data)
        })
        .catch(e => console.log('NO question'))
    },
    setUserDetailsAction ({ commit, state }, object) {
      commit('setUserDetails', object)
    },
    setQuestionRequestAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/question/${localStorage.getItem('username')}/add`,
        data: {
          category: object.category,
          questionTitle: object.questionTitle,
          questionText: object.questionText,
          createdAt: new Date(),
          questionImage: object.imageData,
          status: true
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          const axiosConfigRe = {
            method: 'post',
            baseURL: 'http://10.177.68.73:8084/',
            url: '/multimedia/imageQuestion',
            data: {
              images: [object.imageData],
              question_ID: e.data.questionId
            }
          }
          console.log(axiosConfigRe.data.images)
          console.log(axiosConfigRe.data.question_ID)
          axios(axiosConfigRe)
            .then((e) => {
              console.log(e.data)
            })
        })
        .catch(e => console.log('Not Added'))
    },
    setAnswerRequestAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/${localStorage.getItem('username')}/${object.questionId}`,
        data: {
          answerText: object.answerText,
          imgsrc: object.imageData
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          const axiosConfigRe = {
            method: 'post',
            baseURL: 'http://10.177.68.69:808/',
            url: '/quac/notification/add',
            data: {
              usernameAnswered: localStorage.getItem('username'),
              questionId: object.questionId,
              answerId: e.data.id,
              read: true
            },
            headers: {
              Authorization: localStorage.getItem('sessionId')
            }
          }
          axios(axiosConfigRe)
            .then((e) => console.log(e))
            .catch((e) => console.log(e))
        })
        .catch(e => console.log('Answer Not Posted'))
    },
    setQuestionAnswerRequestDataAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/${localStorage.getItem('username')}/${object}/sort`,
        data: {
          parameter: 'byNew'
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      console.log(object)
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          commit('setQuestionAnswerData', e.data)
          console.log(state.questionAnswerData)
          console.log('ID: ' + object)
          localStorage.setItem('questionId', object)
          router.push('/questionAnswer')
        })
        .catch(e => console.log(e))
    },
    setQuestionAnswerRequestDataByLikesAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/${localStorage.getItem('username')}/${object}/sort`,
        data: {
          parameter: 'byLikes'
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      console.log(object)
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          commit('setQuestionAnswerData', e.data)
          console.log(state.questionAnswerData)
          console.log('ID: ' + object)
          localStorage.setItem('questionId', object)
          router.push('/questionAnswer')
        })
        .catch(e => console.log(e))
    },
    setQuestionAnswerRequestDataByDislikesAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/${localStorage.getItem('username')}/${object}/sort`,
        data: {
          parameter: 'byDislikes'
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      console.log(object)
      axios(axiosConfig)
        .then((e) => {
          commit('setQuestionAnswerData', e.data)
          localStorage.setItem('questionId', object)
          router.push('/questionAnswer')
        })
        .catch(e => console.log(e))
    },
    setAnswerCommentAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/postComment/${localStorage.getItem('username')}`,
        data: {
          answerId: object.answerId,
          text: object.text,
          date: new Date()
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => console.log(e.data))
        .catch(e => console.log(e))
    },
    setSignUpAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: '/users/sign-up',
        data: {
          username: object.username,
          password: object.password
        }
      }
      axios(axiosConfig)
        .then((e) => {
          if (e.data.length < 11) {
            router.push('/categories')
          } else {
            alert('User already exists, change your username')
          }
        })
        .catch(e => console.log(e))
    },
    setLoginAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: '/login',
        data: {
          username: object.username,
          password: object.password
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          localStorage.setItem('sessionId', e.data.Authorization)
          router.push('/')
        })
        .catch(e => console.log(e))
    },
    setCategoriesAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.65:8081/',
        url: '/user/save',
        data: {
          username: localStorage.getItem('username'),
          category: object,
          email: localStorage.getItem('email')
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          alert('Registeration Successful, Please Login Now')
          router.push('/login')
        })
        .catch(e => console.log(e))
    },
    setLikeAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/reaction/${localStorage.getItem('username')}`,
        data: {
          answerId: object.answerId,
          liked: object.isLiked
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
        })
        .catch(e => console.log(e))
    },
    setDislikeAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'post',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/reaction/${localStorage.getItem('username')}`,
        data: {
          answerId: object.answerId,
          liked: object.isLiked
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
        })
        .catch(e => console.log(e))
    },
    setGetAllQuestionsAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: '/quac/question/all',
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          commit('setAllQuestions', e.data)
          // for(var i = 0; i < state.allQuestions.length; i++) {
          //   axios.get('http://10.177.68.73:8084/ge')
          // }
        })
        .catch(e => console.log(e))

      axios.get('http://10.177.68.73:8084/multimedia/getAllQuestionImages')
        .then(e => {
          commit('setQuestionImages', e.data)
        })
    },
    setGetParticularQuestionAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/question/question-id/${object}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          commit('setParticularQuestion', e.data)
        })
        .catch(e => console.log(e))
    },
    setGetUserCategoriesAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/details/user/findByUserName/${localStorage.getItem('username')}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          localStorage.setItem('categoryList', e.data.category)
          console.log(e.data.category)
          commit('setCategoryList', e.data.category)
        })
        .catch(e => console.log(e))
    },
    setGetQuestionsByCategoryAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/question/${object.category}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          commit('setAllQuestions', e.data)
        })
        .catch(e => console.log(e))
    },
    searchByQuestionAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/shikhar/search/question/${object}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          commit('setSearchByQuestionList', e.data)
          router.push('/searchByQuestion')
        })
        .catch(e => console.log(e))
    },
    searchByAnswerAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/shikhar/search/answer/${object}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
        })
        .catch(e => console.log(e))
    },
    searchByUserAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/shikhar/search/name/${object}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          commit('setSearchByUserList', e.data)
          router.push('/searchByUser')
        })
        .catch(e => console.log(e))
    },
    deleteQuestionAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'put',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/question/${localStorage.getItem('username')}/disable/${object}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          router.go()
        })
    },
    deleteAnswerAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'put',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/${localStorage.getItem('username')}/${object.qid}/delete`,
        data: {
          answerId: object.ansid
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          router.go()
        })
    },
    deleteCommentAction ({ commit, state }, object) {
      const axiosConfig = {
        method: 'put',
        baseURL: 'http://10.177.68.69:808/',
        url: `/quac/deleteComment/${localStorage.getItem('username')}`,
        data: {
          commentId: object,
          date: new Date()
        },
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((e) => {
          console.log(e.data)
          router.go()
        })
    },
    getCurrentUserProfileAction ({ commit, state }, value) {
      const axiosConfig = {
        method: 'get',
        baseURL: 'http://10.177.68.69:808/',
        url: `/details/user/findByUserName/${localStorage.getItem('username')}`,
        headers: {
          Authorization: localStorage.getItem('sessionId')
        }
      }
      axios(axiosConfig)
        .then((output) => {
          commit('setCurrentUserDetails', output.data)
        })
        .catch((error) => {
          alert('Can\'t Fetch User Details', error)
        })
    }
    // setNotificationCountAction ({ commit, state }, value) {
    //   const axiosConfig = {
    //     method: 'post',
    //     baseURL: 'http://10.177.68.81:8080/',
    //     url: '/notification/add',
    //     data: {
    //       usernameAnswered: localStorage.getItem('username'),
    //       questionId: value.questionId,
    //       answerId: null,
    //       isRead: true
    //     }
    //   }
    //   axios(axiosConfig)
    //     .then(e => console.log(e))
    //     .catch(e => console.log('No notification'))
    // }
  }
})
