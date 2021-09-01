//Wrapper
 const withDefaultValue= (target,defaultValue= 0)=>{
 	return new Proxy(target,{
 		get:(obj,prop)=>(prop in obj ? obj[prop]: defaultValue)

 	})
 }
 const position = withDefaultValue(
 {
 	x: 24,
 	y:42
 },
 0
 )
 console.log(position)
 // Hidden properties
  const withHiddenProps =(target,prefix = '_')=>{// сделали так что бы те парметры которые начинают с нижнего подчеркивания были видны, но их нельяз ыбло получить
  	return new Proxy(target,{
  		has:(obj,prop)=>prop in obj&&!prop.startsWith(prefix),// делаем проверку лежит ли свойство в обьекте и не начинается ли оно с префикса 		
  		ownKeys: obj => Reflect.ownKeys(obj)
  		.filter(p=>!p.startsWith(prefix)),
  		get: (obj,prop,receiver)=>(prop in receiver// гет получает 3 парматреа на вход, проверяет находится ли свотйсва в ресивере(начинает ли фкнкция с префикса)
  		? obj[prop]// если не начинается с префикса возвращает обжект по ключу тру
  		:void 0)// иначе скрываем строчку

  	}) 
  }
  const data = withHiddenProps({
  	name :'HUI',
  	age:22,
  	_uid:'1wd3'
  })

  // Optimization
 
  //userData.find(user=>user.id ===2) можем с поомщью метода файнд искать эллементы массива
 /* const index ={}
  userData.forEach(i=>(index[i.id]=i))// ищем по айди*/
  const IndexArray = new Proxy(Array,{
construct(target,[args]){
	const index={}// пустой обьект, мы пополняем нашу карту для того что бы она была корректной
	args.forEach(item=> index[item.name]=item)
	return new Proxy (new target(...args),{
get(arr,prop){
	switch(prop){
		case 'push':
		return item=>{
			index[index.name]=item// в индексе по ключу айтем айди мы добавляем новое свойтсво котрое ровняется айтему 
			arr[prop].call(arr,item)// в данном случа проп и пуш одно и тоже		
		} 
	
		case 'findById': 
		return id=> index[id]
		case 'findByName':
		return name=>index[name]
		default:
		 return arr[prop]
	}
}
	})

  }
})
const users = new IndexArray([
	{id: 1, name:'First', job:'tt11',age:22},
{id: 2, name:'Second', job:'tt2',age:27},
{id: 3, name:'Third', job:'tt3',age:23},
{id: 4, name:'Fourth', job:'tt4',age:28},
	])
// заменив в констракте айди на найм, функция файнд бай нейм стала активной
