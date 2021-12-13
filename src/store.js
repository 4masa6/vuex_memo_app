import { createStore } from 'vuex'
import createPersistedState from 'vuex-persistedstate'

export const store = createStore({
  state: () => {
    return {
      memo: [], // メモの内容を管理
      page: 0, // 表示しているページ番号を保管
    }
  },
  mutations: {
    // 新しいメモを追加するメソッド
    insert: (state, obj) => { // obj ⇒ メモのタイトル、コンテンツが渡される。これらと、投稿された日時の敵捨つをmemoステートの最初に追加する。
      var d = new Date()
      var fmt = d.getFullYear() + '-' + (d.getMonth() + 1) + '-' + d.getDate() + ' ' + d.getHours() + ':' + d.getMinutes()
      state.memo.unshift({
        title: obj.title,
        content: obj.content,
        created: fmt
      })
    },
    // 表示するページ
    set_page: (state, p) => { // 表示ページを表すpageステートの値をpに更新
      state.page = p;
    },
    // メモの削除
    remove: (state, obj) => { // obj ⇒ 削除するメモのオブジェクト（タイトル、コンテンツ、作成日時の情報）
      for (let i = 0; i < state.memo.length; i++) {
        const obj = state.memo[i]
        if (obj.title == obj.title && obj.content == obj.content && obj.created == obj.created ) {
          alert('-- remove it! --' + obj.title)
          state.memo.splice(i, 1)
          return
        }
      }
    },
  },
  plugins: [
    createPersistedState(),
  ],
})
