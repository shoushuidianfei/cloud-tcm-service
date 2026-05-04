export function validatePhone(rule, value, callback) {
  const phoneReg = /^1[3-9]\d{9}$/
  if (!value) {
    callback(new Error('请输入手机号'))
  } else if (!phoneReg.test(value)) {
    callback(new Error('请输入正确的手机号'))
  } else {
    callback()
  }
}

export function validateIdCard(rule, value, callback) {
  const idCardReg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/
  if (!value) {
    callback(new Error('请输入身份证号'))
  } else if (!idCardReg.test(value)) {
    callback(new Error('请输入正确的身份证号'))
  } else {
    callback()
  }
}

export function validateFileSize(file, maxSizeMB = 10) {
  const isValid = file.size / 1024 / 1024 < maxSizeMB
  if (!isValid) {
    ElMessage.error(`文件大小不能超过 ${maxSizeMB}MB`)
  }
  return isValid
}

export function validateFileType(file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) {
  const isValid = allowedTypes.includes(file.type)
  if (!isValid) {
    ElMessage.error('只支持 JPG、PNG、PDF 格式')
  }
  return isValid
}
