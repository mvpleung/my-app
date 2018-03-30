import Mock from 'mockjs';

// 获取 mock.Random 对象
const Random = Mock.Random;

/**
 * 处理回调
 */
const callback = data => {
  return {
    ret: 0,
    errmsg: 'OK',
    errors: null,
    result_data: data,
    result_code: 1000
  };
};

/**
 * 可开票订单列表
 */
const ChargeList = () => {
  return {
    data: [
      {
        lpn: '粤B12345',
        charge: 100,
        parkName: Random.cname(), // Random.cname() 随机生成一个常见的中文姓名
        payTime: Random.date() + ' ' + Random.time(), // Random.date()指示生成的日期字符串的格式,默认为yyyy-MM-dd；Random.time() 返回一个随机的时间字符串
        payType: '2',
        orderId: Random.guid(),
        parkCode: '3456liyx',
        id: Random.id()
      }
    ],
    count: 1
  };
};

/**
 * 停车场列表
 */
const ParkingList = () => {
  return {
    datas: [
      {
        provice: null,
        code: '201801261039',
        type: '2',
        isStaPark: '1',
        city: '320200',
        id: '000000006131b43c0161320df60c003b',
        distance: '0.0',
        charge: '测试宝康lhf',
        allCount: 50,
        allSCount: 238,
        isLongRent: '1',
        address: '测试地址',
        name: '测试新宝康lhf',
        longitude: '121.5345',
        latitude: '31.5353',
        district: '320211',
        isNetPay: '1'
      },
      {
        provice: null,
        code: 'tiantian2',
        type: '1',
        isStaPark: '1',
        city: '320200',
        id: '402881e8615092a401616f1323eb005d',
        distance: '0.11',
        charge: '',
        allCount: 233,
        allSCount: 0,
        isLongRent: '0',
        address: '无锡新区',
        name: '天天测试2',
        longitude: '121.53432',
        latitude: '31.53432',
        district: '320203',
        isNetPay: '1'
      },
      {
        provice: null,
        code: 'chengzhi',
        type: '1',
        isStaPark: '1',
        city: '310100',
        id: '402881e8614f57eb01614ff3db86000e',
        distance: '1.417',
        charge: '',
        allCount: 100,
        allSCount: 1600,
        isLongRent: '1',
        address: '诚智停车场',
        name: '诚智停车场',
        longitude: '121.5435435',
        latitude: '31.54543',
        district: '310103',
        isNetPay: '1'
      }
    ],
    resultCount: 3
  };
};

// Mock.mock( url, post/get , 返回的数据)；
// Mock.mock(/v1\/phtons\/getChargeList/, 'get', callback(ChargeList)); //开票订单列表
Mock.mock(/v1\/phtons\/getNearParkList/, 'get', callback(ParkingList)); //附近停车场列表
