export const mockUsers = [
  { id: 'U001', username: 'patient1', password: '123456', name: '张三', role: 'patient', avatar: '' },
  { id: 'U002', username: 'patient2', password: '123456', name: '李四', role: 'patient', avatar: '' },
  { id: 'U003', username: 'doctor1', password: '123456', name: '王医师', role: 'doctor', avatar: '' },
  { id: 'U004', username: 'doctor2', password: '123456', name: '陈医师', role: 'doctor', avatar: '' },
  { id: 'U005', username: 'admin', password: '123456', name: '管理员', role: 'admin', avatar: '' }
]

export const mockDoctors = [
  {
    id: 'D001',
    userId: 'U003',
    name: '王建国',
    gender: '男',
    age: 45,
    phone: '13800138001',
    department: '中医内科',
    title: '主任医师',
    specialties: ['脾胃病', '肝胆疾病', '慢性胃炎'],
    introduction: '从事中医内科临床工作20余年，擅长运用中医药治疗脾胃病、肝胆疾病等内科常见病及疑难杂症。',
    experience: 20,
    education: '北京中医药大学博士',
    certificates: [
      { name: '医师执业证书', url: '/certs/cert1.jpg' },
      { name: '医师资格证书', url: '/certs/cert2.jpg' }
    ],
    auditStatus: 'approved',
    rejectReason: '',
    schedule: [
      { day: '周一', slots: ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30', '10:30-11:00'] },
      { day: '周三', slots: ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '14:00-14:30', '14:30-15:00'] },
      { day: '周五', slots: ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00'] }
    ],
    createdAt: '2024-01-15T08:00:00Z',
    updatedAt: '2024-01-20T10:00:00Z'
  },
  {
    id: 'D002',
    userId: 'U004',
    name: '陈明辉',
    gender: '男',
    age: 38,
    phone: '13800138002',
    department: '针灸推拿科',
    title: '副主任医师',
    specialties: ['颈椎病', '腰椎间盘突出', '肩周炎'],
    introduction: '毕业于上海中医药大学，精通针灸、推拿、拔罐等中医传统疗法，对颈肩腰腿痛有丰富临床经验。',
    experience: 12,
    education: '上海中医药大学硕士',
    certificates: [
      { name: '医师执业证书', url: '/certs/cert3.jpg' }
    ],
    auditStatus: 'approved',
    rejectReason: '',
    schedule: [
      { day: '周二', slots: ['08:00-08:30', '08:30-09:00', '09:00-09:30', '09:30-10:00', '10:00-10:30'] },
      { day: '周四', slots: ['14:00-14:30', '14:30-15:00', '15:00-15:30', '15:30-16:00'] },
      { day: '周六', slots: ['08:00-08:30', '08:30-09:00', '09:00-09:30'] }
    ],
    createdAt: '2024-02-01T08:00:00Z',
    updatedAt: '2024-02-05T10:00:00Z'
  },
  {
    id: 'D003',
    userId: 'U006',
    name: '刘芳',
    gender: '女',
    age: 42,
    phone: '13800138003',
    department: '中医妇科',
    title: '主任医师',
    specialties: ['月经不调', '不孕不育', '更年期综合征'],
    introduction: '中医妇科专家，从事妇科临床工作18年，擅长运用中医药调理女性内分泌，治疗各种妇科疑难杂症。',
    experience: 18,
    education: '广州中医药大学博士',
    certificates: [
      { name: '医师执业证书', url: '/certs/cert4.jpg' },
      { name: '医师资格证书', url: '/certs/cert5.jpg' }
    ],
    auditStatus: 'pending',
    rejectReason: '',
    schedule: [
      { day: '周一', slots: ['09:00-09:30', '09:30-10:00', '10:00-10:30', '14:00-14:30', '14:30-15:00'] },
      { day: '周三', slots: ['09:00-09:30', '09:30-10:00', '10:00-10:30'] }
    ],
    createdAt: '2024-02-15T08:00:00Z',
    updatedAt: '2024-02-15T08:00:00Z'
  },
  {
    id: 'D004',
    userId: 'U007',
    name: '赵伟',
    gender: '男',
    age: 50,
    phone: '13800138004',
    department: '中医骨伤科',
    title: '主任医师',
    specialties: ['骨折', '关节脱位', '软组织损伤'],
    introduction: '中医骨伤科资深专家，擅长运用传统正骨手法治疗各类骨折、脱位及软组织损伤。',
    experience: 25,
    education: '成都中医药大学博士',
    certificates: [
      { name: '医师执业证书', url: '/certs/cert6.jpg' }
    ],
    auditStatus: 'rejected',
    rejectReason: '证书照片不清晰，请重新上传',
    schedule: [],
    createdAt: '2024-03-01T08:00:00Z',
    updatedAt: '2024-03-05T10:00:00Z'
  }
]

export const mockSchedules = [
  { id: 'S001', doctorId: 'D001', date: '2024-03-18', timeSlot: '08:00-08:30', day: '周一' },
  { id: 'S002', doctorId: 'D001', date: '2024-03-18', timeSlot: '08:30-09:00', day: '周一' },
  { id: 'S003', doctorId: 'D001', date: '2024-03-18', timeSlot: '09:00-09:30', day: '周一' },
  { id: 'S004', doctorId: 'D001', date: '2024-03-18', timeSlot: '09:30-10:00', day: '周一' },
  { id: 'S005', doctorId: 'D001', date: '2024-03-18', timeSlot: '10:00-10:30', day: '周一' },
  { id: 'S006', doctorId: 'D001', date: '2024-03-18', timeSlot: '10:30-11:00', day: '周一' },
  { id: 'S007', doctorId: 'D001', date: '2024-03-20', timeSlot: '08:00-08:30', day: '周三' },
  { id: 'S008', doctorId: 'D001', date: '2024-03-20', timeSlot: '08:30-09:00', day: '周三' },
  { id: 'S009', doctorId: 'D001', date: '2024-03-20', timeSlot: '14:00-14:30', day: '周三' },
  { id: 'S010', doctorId: 'D002', date: '2024-03-19', timeSlot: '08:00-08:30', day: '周二' },
  { id: 'S011', doctorId: 'D002', date: '2024-03-19', timeSlot: '08:30-09:00', day: '周二' },
  { id: 'S012', doctorId: 'D002', date: '2024-03-19', timeSlot: '09:00-09:30', day: '周二' },
  { id: 'S013', doctorId: 'D002', date: '2024-03-21', timeSlot: '14:00-14:30', day: '周四' },
  { id: 'S014', doctorId: 'D002', date: '2024-03-21', timeSlot: '14:30-15:00', day: '周四' }
]

export const mockAppointments = [
  {
    id: 'A001',
    patientId: 'U001',
    patientName: '张三',
    doctorId: 'D001',
    doctorName: '王建国',
    department: '中医内科',
    appointmentDate: '2024-03-18',
    timeSlot: '08:00-08:30',
    status: 'completed',
    symptoms: '胃痛、消化不良',
    createdAt: '2024-03-15T10:00:00Z',
    updatedAt: '2024-03-18T08:30:00Z'
  },
  {
    id: 'A002',
    patientId: 'U001',
    patientName: '张三',
    doctorId: 'D002',
    doctorName: '陈明辉',
    department: '针灸推拿科',
    appointmentDate: '2024-03-19',
    timeSlot: '08:30-09:00',
    status: 'waiting',
    symptoms: '颈椎疼痛',
    createdAt: '2024-03-16T14:00:00Z',
    updatedAt: '2024-03-16T14:00:00Z'
  },
  {
    id: 'A003',
    patientId: 'U002',
    patientName: '李四',
    doctorId: 'D001',
    doctorName: '王建国',
    department: '中医内科',
    appointmentDate: '2024-03-18',
    timeSlot: '09:00-09:30',
    status: 'waiting',
    symptoms: '失眠、乏力',
    createdAt: '2024-03-17T09:00:00Z',
    updatedAt: '2024-03-17T09:00:00Z'
  },
  {
    id: 'A004',
    patientId: 'U001',
    patientName: '张三',
    doctorId: 'D001',
    doctorName: '王建国',
    department: '中医内科',
    appointmentDate: '2024-03-10',
    timeSlot: '10:00-10:30',
    status: 'cancelled',
    symptoms: '腹痛',
    createdAt: '2024-03-08T11:00:00Z',
    updatedAt: '2024-03-09T16:00:00Z'
  }
]

export const departments = [
  '中医内科',
  '中医外科',
  '针灸推拿科',
  '中医妇科',
  '中医儿科',
  '中医骨伤科',
  '中医皮肤科',
  '中医眼科'
]

export const specialtyOptions = [
  '脾胃病', '肝胆疾病', '慢性胃炎', '失眠', '咳嗽',
  '颈椎病', '腰椎间盘突出', '肩周炎', '面瘫',
  '月经不调', '不孕不育', '更年期综合征',
  '骨折', '关节脱位', '软组织损伤',
  '湿疹', '荨麻疹', '痤疮',
  '近视', '干眼症'
]
