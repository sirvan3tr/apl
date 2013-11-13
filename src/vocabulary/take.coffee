addVocabulary

  '↑': (omega, alpha) ->
    if alpha
      take omega, alpha
    else
      first omega

# Take (`↑`)
#
# 5↑'ABCDEFGH'     <=> 'ABCDE'
# ¯3↑'ABCDEFGH'    <=> 'FGH'
# 3↑22 2 19 12     <=> 22 2 19
# ¯1↑22 2 19 12    <=> ,12
# ⍴1↑(2 2⍴⍳4)(⍳10) <=> ,1
# 2↑1              <=> 1 0
# 5↑40 92 11       <=> 40 92 11 0 0
# ¯5↑40 92 11      <=> 0 0 40 92 11
# 3 3↑1 1⍴0        <=> 3 3⍴0 0 0 0 0 0 0 0 0
# 5↑"abc"          <=> 'abc  '
# ¯5↑"abc"         <=> '  abc'
# 3 3↑1 1⍴"a"      <=> 3 3⍴'a        '
# 2 3↑1+4 3⍴⍳12    <=> 2 3⍴1 2 3 4 5 6
# ¯1 3↑1+4 3⍴⍳12   <=> 1 3⍴10 11 12
# 1 2↑1+4 3⍴⍳12    <=> 1 2⍴1 2
# 3↑⍬              <=> 0 0 0
# ¯2↑⍬             <=> 0 0
# 0↑⍬              <=> ⍬
# 3 3↑1            <=> 3 3⍴1 0 0 0 0 0 0 0 0
# 2↑3 3⍴⍳9         <=> 2 3⍴⍳6
# ¯2↑3 3⍴⍳9        <=> 2 3⍴3+⍳6
# 4↑3 3⍴⍳9         <=> 4 3⍴(⍳9),0 0 0
# ⍬↑3 3⍴⍳9         <=> 3 3⍴⍳9
take = (omega, alpha) ->
  if alpha.shape.length > 1
    rankError()
  if omega.shape.length is 0
    omega = new APLArray [omega.unwrap()], (if alpha.shape.length is 0 then [1] else repeat [1], alpha.shape[0])
  a = alpha.toArray()
  if a.length > omega.shape.length
    rankError()
  for x in a when typeof x isnt 'number' or x isnt Math.floor x then domainError()

  mustCopy = false
  shape = omega.shape[...]
  for x, i in a
    shape[i] = Math.abs x
    if shape[i] > omega.shape[i]
      mustCopy = true

  if mustCopy
    stride = Array shape.length
    stride[stride.length - 1] = 1
    for i in [stride.length - 2 .. 0] by -1
      stride[i] = stride[i + 1] * shape[i + 1]
    data = repeat [omega.getPrototype()], prod shape
    copyShape = shape[...]
    p = omega.offset
    q = 0
    for x, i in a
      copyShape[i] = Math.min omega.shape[i], Math.abs x
      if x < 0
        if x < -omega.shape[i]
          q -= (x + omega.shape[i]) * stride[i]
        else
          p += (x + omega.shape[i]) * omega.stride[i]
    if prod copyShape
      copyIndices = repeat [0], copyShape.length
      loop
        data[q] = omega.data[p]
        axis = copyShape.length - 1
        while axis >= 0 and copyIndices[axis] + 1 is copyShape[axis]
          p -= copyIndices[axis] * omega.stride[axis]
          q -= copyIndices[axis] * stride[axis]
          copyIndices[axis--] = 0
        if axis < 0 then break
        p += omega.stride[axis]
        q += stride[axis]
        copyIndices[axis]++
    new APLArray data, shape, stride
  else
    offset = omega.offset
    for x, i in a
      if x < 0
        offset += (omega.shape[i] + x) * omega.stride[i]
    new APLArray omega.data, shape, omega.stride, offset

# First (`↑`)
#
# ↑(1 2 3)(4 5 6)   <=> 1 2 3
# ↑(1 2)(3 4 5)     <=> 1 2
# ↑'AB'             <=> 'A'
# ↑123              <=> 123
# ↑⍬                <=> 0
#!    ↑''               <=> ' '
first = (omega) ->
  x = if omega.empty() then omega.getPrototype() else omega.data[omega.offset]
  if x instanceof APLArray then x else new APLArray [x], []
