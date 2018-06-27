<template>
    <Modal  v-model="modal.isModal" :styles="{marginTop: '-20px'}">
      <p slot="header" style="color:#2d8cf0;text-align:center">
          <Icon type="information-circled" />
          <span>{{modal.title}} 配置</span>
      </p>
      <p slot="footer" style="color:#2d8cf0;text-align:center">
          <Button long @click="modal.isModal=false">确 定</Button>
      </p>
      <div>
        <div class="inline">
          <p>{{modal.input.label}}</p>
          <Input 
            v-model.trim="ipnutVal"
            placeholder="按enter键添加"
            style="width: 160px"
            clearable
            @on-enter="add" />
        </div>
        <div class="tagContent">
          <Tag
            v-for="(item, i) of modal.list"
            :key="i"
            :name="item"
            color="blue"
            closable
            type="border"
            @on-close="del">{{item}}</Tag>
        </div>
      </div>
    </Modal>
</template>

<script>
  export default {
      props: {
          modal: {
              type: Object,
              required: true
          }
      },
      data() {
        return {
          ipnutVal: '',
          formData: {}
        }
      },
      methods: {
        add() {
          this.$emit('addTag', this.ipnutVal)
          this.ipnutVal = ''
        },
        del(e, name) {
          this.$emit('delTag', name)
        }
      }
  }  
</script>

<style lang="css" scoped>
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