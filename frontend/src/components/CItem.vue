<template>
  <FormItem>
    <div slot="label">
      <Tooltip :content="itemData.tooltip" placement="bottom-start">
        {{ itemData.title }}
        <Icon type="help-circled" size="16" color="#2d8cf0" class="cursor" />
      </Tooltip>
    </div>
    <i-switch v-model="itemData.enabled">
      <Icon type="android-done" slot="open"></Icon>
      <Icon type="android-close" slot="close"></Icon>
    </i-switch>
    <Button
      v-show="itemData.enabled"
      size="small"
      class="exclude_btn"
      type="dashed"
      @click="itemData.isModal = true"
      >添加{{ itemData.title }}</Button
    >
  </FormItem>
</template>

<script>
export default {
  props: {
    itemData: {
      type: Object,
      required: true,
    },
  },
};
</script>

<style lang="css" scoped>
.exclude_btn {
  margin-left: 40px;
}
.cursor {
  cursor: pointer;
}
</style>