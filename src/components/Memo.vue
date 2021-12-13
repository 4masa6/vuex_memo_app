<template>
  <section class="alert alert-primary">
    <div class="form-control-group row">
      <label class="col-12 text-left h5">Title</label>
      <input v-model="data.title" @focus='set_flg' type="text" name="title" class="form-control col-9 ml-2">
      <button @click="find" class="btn btn-primary col-2 ml-2">find</button>
    </div>
    <div class="form-control-group mt-3">
      <label class="col-12 text-left h5">Memo</label>
      <textarea v-model="data.content" name="content" class="form-control"></textarea>
    </div>
    <div>
      <button class="btn btn-info m-2" @click="insert">save</button>
      <transition name="del">
        <button v-if="data.sel_flg != false" @click="remove" class="btn btn-info m-2">delete</button>
      </transition>
    </div>
    <ul class="list-group">
      <li v-for="item in page_items" :key="item" @click="select(item)" class="list-group-item list-group-item-action text-left">
        {{ item.title }} ({{ item.created }})
      </li>
    </ul>
    <hr>
    <div>
      <span class="btn btn-secondary mr-2" @click="prev">&lt; prev</span>
      <span class="btn btn-secondary ml-2" @click="next">next &gt;</span>
    </div>
  </section>
</template>

<script>
import { ref, reactive, computed, onMounted } from 'vue'
import { useStore } from 'vuex'
export default {
  setup(props) {
    // リアクティブデータ
    const data = reactive({
      title: '',
      content: '',
      num_per_page: 5,
      find_flg: false,
      sel_flg: false,
      sel_item: null,
      store: useStore(),
    })
    // フラグの初期化
    const set_flg = () => {
      if (data.find_flg.value || data.sel_flg != false) {
        data.find_flg = false
        data.sel_flg = false
        data.title = ''
        data.content = ''
      }
    }
    // 項目の選択
    const select = (item) => {
      data.find_flg = false
      data.sel_flg  = true
      data.title    = item.title
      data.content  = item.content
      data.sel_item = item
    }
    // 検索の設定
    const find = () => {
      data.sel_flg  = false
      data.find_flg = true
    }

    // メモの追加
    const insert = () => {
      data.store.commit('insert', {title: data.title, content: data.content})
      data.title  = ''
      data.content = ''
    }
    // 選択項目の削除
    const remove = () => {
      if (data.sel_flg) {
        data.store.commit('remove', data.sel_item)
        sel_flg()
      }
    }
    // 次ページ
    const next = () => {
      page.value++
    }
    // 前のページ
    const prev = () => {
      page.value--
    }
    // メモ全体
    const memo = computed(() => data.store.state.memo)
    // ページの表示項目
    const page_items = computed(function() {
      if (data.find_flg) {
        var arr = []
        var rec = data.store.state.memo
        rec.forEach(element => {
          console.log()
          if (element.title.toLowerCase().indexOf(data.title.toLowerCase()) >= 0) {
            arr.push(element)
          }
        })
        return arr
      } else {
        return data.store.state.memo.slice(data.num_per_page * data.store.state.page, data.num_per_page * (data.store.state.page +1))
      }
    })
    // 表示ページを表す値
    const page = computed({
      get: () => {
        return data.store.state.page
      },
      set: (p) => {
        var pg = p > (data.store.state.memo.length -1) / data.num_per_page ? Math.ceil((data.store.state.memo.length - 1) / data.num_per_page) - 1 : p
        pg     = pg < 0 ? 0 : pg
        data.store.commit('set_page', pg)
      }
    })
    // マウント時の処理
    onMounted(() => {
      data.store.commit('set_page', 0)
    })
    // 戻り値
    return {
      data, set_flg, select, find, insert, remove, next, prev, memo, page_items, page, 
    }
  },
}
</script>
