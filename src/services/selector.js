import { finder } from '@medv/finder'
//cssѡ����������

export default function selector(e, { dataAttribute } = {}) {
  //����
  if (dataAttribute && e.target.getAttribute(dataAttribute)) {
    return `[${dataAttribute}="${e.target.getAttribute(dataAttribute)}"]`
  }

  //id
  if (e.target.id) {
    return `#${e.target.id}`
  }

  return finder(e.target, {
    seedMinLength: 7, //����ѡ�����м������С����
    optimizedMinLength: e.target.id ? 2 : 10, //�Ż�ѡ��������С����
    attr: name => name === dataAttribute, //����Ƿ����ʹ�� attr ����
  })
}
