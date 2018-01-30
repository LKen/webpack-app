/**
 * 定义全局参数
 */
import Vue from 'vue';

// 将在各处使用该事件中心
// 组件通过它来通信
var eventHub = new Vue();

export default {
	eventHub
};
