<!-- 数字框 子组件 -->

<template>
    <div class="count-box">
        <button @click="handleSub" class="minus">-</button>
        <input :value="value" @change="handleChange" class="inp" type="text">
        <button @click="handleAdd" class="add">+</button>
    </div>
</template>

<script>
export default {
  name: 'CountBox',
  props: {
    value: {
      type: Number,
      default: 1 // 默认值
    }
  },
  methods: {
    // 减少函数
    handleSub () {
      if (this.value <= 1) return // 最小为1
      this.$emit('input', this.value - 1) // 子传父
    },
    // 增加函数
    handleAdd () {
      this.$emit('input', this.value + 1)
    },
    // 修改函数
    handleChange (e) {
      const num = +e.target.value.trim() // 获取输入栏的值(隐式转换)
      e.target.value = this.value // 数值回显
      // 若输入了不合法的文本 或 输入了负值，回退成原来的 value 值
      if (isNaN(num) || num < 1) return (e.target.value = this.value)
      this.$emit('input', Math.floor(num)) // 子传父(向下取整)
    }
  }
}
</script>

<style lang="less" scoped>
.count-box {
    width: 110px;
    display: flex;

    .add,
    .minus {
        width: 30px;
        height: 30px;
        outline: none;
        border: none;
        background-color: #efefef;
    }

    .inp {
        width: 40px;
        height: 30px;
        outline: none;
        border: none;
        margin: 0 5px;
        background-color: #efefef;
        text-align: center;
    }
}
</style>
