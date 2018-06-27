<template>
  <div id="wrapper" ref="drag" class="drag">
    <Form :label-width="85" label-position="left">
      <!--添加文件路径-->
      <FormItem label="添加文件(夹)">
          <p style="color:#5098ff">将文件或文件夹拖拽到界面即可添加</p>
      </FormItem>
      <FormItem>
        <div slot="label">
          已添加
          <Tooltip content="目前仅支持同时统计一个文件和一个文件夹">
            <Icon type="help-circled" size="16" color="#2d8cf0" class="cursor" />
          </Tooltip>
        </div>
        <Input type="text" v-model="showFileName" readonly />
      </FormItem>
      <!--添加过滤-->
      <CItem 
        :itemData="exclude"
      />
      <!--添加自定义注释-->
      <CItem 
        :itemData="commentRule"
      />
      <div class="tagContent">
        <Tag
          v-for="item of showCommentRule"
          :key="item.type"
          :name="item.type"
          color="blue"
          closable
          type="border"
          @on-close="delCommentRule">{{item.msg}}</Tag>
      </div>
    </Form>
    <div class="count_btn">
      <Button @click="codeCount">开始统计</Button>
    </div>
    <!--过滤的modal-->
    <CModal 
      :modal="exclude" 
      @addTag="addExclude"
      @delTag="delExclude" 
    />
    <!--注释规则的modal-->
    <Modal v-model="commentRule.isModal" :styles="{marginTop: '-20px'}">
      <p slot="header" style="color:#2d8cf0;text-align:center">
          <Icon type="information-circled" />
          <span>{{commentRule.title}} 配置</span>
      </p>
      <p slot="footer" style="color:#2d8cf0;text-align:center">
          <Button long @click="addCommentRule">添 加</Button>
      </p>
      <div class="inline"
        v-for="(input, i) of commentRule.input"
        :key="i">
        <p>{{input.label}}</p>
        <Input 
          v-model.trim="input.value"
          :placeholder="input.placeholder"
          style="width: 150px"
          clearable />
      </div>
    </Modal>
  </div>
</template>

<script>
  const path = require('path')
  import counter from '@/utils/index.js'
  import CModal from '@/common/CModal'
  import CItem from '@/common/CItem'
  export default {
    name: 'AddFile',
    components: {
      CModal,
      CItem
    },
    data() {
      return {
        fileList: {file: '', dictionary: ''},
        exclude: {
          isModal: false,
          enabled: false,
          title: '过滤',
          tooltip: '可以过滤文件，文件夹和指定后缀名文件',
          input: {label: '过滤文件', value: ''},
          list: []
        },
        commentRule: {
          isModal: false,
          enabled: false,
          title: '注释规则',
          tooltip: '可以添加多条规则，包含单行和多行注释',
          input: [
            {label: '文件后缀名', value: '', placeholder: '例如: js'},
            {label: '单行注释', value: '', placeholder: '例如：//'},
            {label: '多行注释起始', value: '', placeholder: '例如：/*'},
            {label: '多行注释结束', value: '',  placeholder: '例如：*/'}
          ],
          list: {}
        }
      }
    },
    computed: {
      showFileName() {
        const name = Object.values(this.fileList).map(a => a.name)
        const hasVal = name.some(a => Boolean(a) != false)
        const hasAllVal = name.every(a => Boolean(a) != false)
        if(hasVal) {
          return hasAllVal? name.join(', '): name.find(a => Boolean(a) != false)
        }
        else {
          return ''
        }
      },
      showCommentRule() {
        const list = Object.entries(this.commentRule.list)
        var arr = []
        list.forEach(a => {
          a[1].forEach((b, i) => {
            arr.push({
              type: `${a[0]}-${i}`,
              msg: `${a[0]} & ${b.multiple.start || ''}${b.multiple.end || ''} & ${b.single || ''}`
            })
          })
        })
        return arr
      }
    },
    watch: {
      'exclude.enabled'(val) {
        if(!val) {
          this.exclude.list = []
        }
      },
      'commentRule.enabled'(val) {
        if(!val) {
          this.commentRule.list = []
        }
      }
    },
    mounted() {
      this.$refs.drag.addEventListener('dragover', (e) => {
        e.preventDefault()
        e.stopPropagation()
      })
      this.$refs.drag.addEventListener('drop', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const files = e.dataTransfer.files
        for(let a of files) {
          const type = a && !a.type && !path.extname(a.path)? 'dictionary': 'file'
          const filePath = a && a.path
          const name = a && a.name
          if(type == 'file') {
            this.fileList.file = {type, filePath, name}
          }
          else if(type == 'dictionary') {
            this.fileList.dictionary = {type, filePath, name}
          }
        }
        // console.log(this.fileList)
      })
    },
    methods: {
      //添加过滤
      addExclude(val) {
        if(val) {
          this.exclude.list.push(val)
        }
      },
      //删除过滤
      delExclude(name) {
        const index = this.exclude.list.findIndex(a => a == name)
        this.exclude.list.splice(index, 1)
      },
      //添加自定义注释规则
      addCommentRule() {
        this.commentRule.isModal = false
        const filter = this.commentRule.input.filter((a, b) =>  b>0)
        const hasVal = this.commentRule.input[0].value && filter.some(a => a.value != '')
        //只让有值才添加
        if(hasVal) { 
          const key = this.commentRule.input[0].value
          const single = filter[0].value
          const val = [
                    {
                      multiple: {
                        start: filter[1].value,
                        end: filter[2].value
                      },
                      single
                    }
                  ]

          const isSameExtNameAddRule = Object.keys(this.commentRule.list).some(a => a == key)
          //先判断是添加一个新后缀文件规则还是在原有文件里添加规则
          if(isSameExtNameAddRule) {
            const isRuleRepeat = Object.values(this.commentRule.list[key]).some(a => {
              return (filter[1].value && a.multiple.start == filter[1].value )
                      || (filter[2].value && a.multiple.end == filter[2].value)
                      || (filter[0].value && a.single == filter[0].value)  
            })
            //判断在原有文件添加的规则是否重复
            if(!isRuleRepeat) {
              this.commentRule.list[key] = [...this.commentRule.list[key], ...val]
            }
            else {
              this.$Modal.info({
                title: '提示',
                content: '请不要在同一后缀名文件添加重复规则',
              })
            }
          }
          else {
            this.$set(this.commentRule.list, [key], val)
          }
          // console.log(this.commentRule.list)
        }
      },
      //删除自定义注释规则
      delCommentRule(e, name) {
        const key = name.split('-')[0]
        const index = name.split('-')[1]
        this.commentRule.list[key].splice(index, 1)
      },
      //统计代码
      codeCount() {
        this.$Spin.show()
        const file = this.fileList.file.filePath 
        const dictionary = this.fileList.dictionary.filePath 
        const fileList = {file, dictionary}
        const exclude = this.exclude.list
        const rule = this.commentRule.list

        const startTime = new Date().getTime() 
         
        counter(fileList, exclude, rule, (res, msg) => {
          const wasteTime = ((new Date().getTime() - startTime)/1000).toFixed(2)
          msg.push(` 总耗时： ${wasteTime}s`)
          window.sessionStorage.setItem('msg', JSON.stringify(msg))
          window.sessionStorage.setItem('result', JSON.stringify(res))
          this.$Spin.hide()
          this.$router.push('/showResult')
        })
      }
    }
  }
</script>

<style scoped>
  .cursor {
    cursor: pointer;
  }
  #wrapper {
    box-sizing: border-box;
    padding: 30px 20px;
  }
  .count_btn {
    margin-top: 20px;
    text-align: center;
  }
  .tagContent {
    height: 100px;
    overflow: auto;
  }   
  .inline {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
  }
</style>
