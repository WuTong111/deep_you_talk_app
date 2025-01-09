Page({
  data: {
    messages: [], // 聊天消息列表
    inputValue: '', // 输入框内容
    isLoading: false, // 是否正在加载
  },

  // 监听输入框内容变化
  onInput: function (e) {
    this.setData({
      inputValue: e.detail.value,
    });
  },

  // 发送消息
  sendMessage: function () {
    const userMessage = this.data.inputValue.trim();
    if (!userMessage) return;

    // 添加用户消息
    const newMessage = { role: 'user', content: userMessage };
    this.setData({
      messages: [...this.data.messages, newMessage],
      inputValue: '', // 清空输入框
      isLoading: true, // 显示加载动画
    });

    // 发起 HTTP POST 请求
    wx.request({
      url: 'http://localhost:5000/chat', // 后端接口地址
      method: 'POST',
      header: {
        'Content-Type': 'application/json',
      },
      data: JSON.stringify({ message: userMessage }),
      success: (res) => {
        console.log('请求成功:', res);
        if (res.statusCode === 200) {
          const assistantMessage = { role: 'assistant', content: res.data.message };
          this.setData({
            messages: [...this.data.messages, assistantMessage],
            isLoading: false, // 隐藏加载动画
          });
        }
      },
      fail: (err) => {
        console.error('请求失败:', err);
        this.setData({
          isLoading: false, // 隐藏加载动画
        });
      },
    });
  },
});