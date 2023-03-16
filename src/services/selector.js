import { finder } from '@medv/finder'
//css选择器的生成

export default function selector(e, { dataAttribute } = {}) {
  //属性
  if (dataAttribute && e.target.getAttribute(dataAttribute)) {
    return `[${dataAttribute}="${e.target.getAttribute(dataAttribute)}"]`
  }

  //id
  if (e.target.id) {
    return `#${e.target.id}`
  }

  return finder(e.target, {
    seedMinLength: 7, //精炼选择器中级别的最小长度
    optimizedMinLength: e.target.id ? 2 : 10, //优化选择器的最小长度
    attr: name => name === dataAttribute, //检查是否可以使用 attr 名称
  })
}
