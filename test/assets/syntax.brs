function a()
  a$ ="a rose is a rose"
  b1=1.23
  x=x-z1

  aa = { joe: 10, fred: 11, sue:9 }

  for each n In aa
    print n;aa[n]
    aa.delete(n)
  end for
end function


function gotoStatement()
  mylabel:
  print "Anthony was here!"
  goto mylabel
end function

function whileStatement()
  k = 0
  while k = 0
    k = 1
    print "loop once"
  end while

  while true
    print "loop once"
    if k <> 0 then exit while
  end while
end function

function lineIf()
  if x > 127 then print "out of range"
  if caveman = "fred" then print "flintstone" else print "rubble"
end function


function blockIf()
  msg = wait(0, p)
  if type(msg) = "roVideoPlayerEvent" then
    if debug then print "video event"
    if msg.isFullResult()
    if debug then print "video finished"
    return 9
  end if
else if type(msg) = "roUniversalControlEvent" then
  if debug then print "button press "; msg.GetInt()
  HandleButton(msg.GetInt())
else if msg = invalid then
  if debug print "timeout"
  return 6
else

end if
end function



function posSt()
  print tab(40) pos(0) 'prints 40 at position 40
  print "these" tab(pos(0)+5)"words" tab(pos(0)+5)"are";print tab(pos(0)+5)"evenly" tab(pos(0)+5)"spaced"
end function


function cat(a, b)
  return a+b 'a, b could be numbers or strings
end function

function five() as integer
  return 5
end function

function add(a as integer, b as integer) as integer
  return a+b
end function


function add2(a as integer, b=5 as integer) as integer
  return a+b
end function


function add3(a as integer, b=a+5 as integer) as integer
  return a+b
end function



sub main()
  obj={
    add: add
    a: 5
    b: 10
  }

  obj.add()
  obj.add().more(5,4,3,3)

  print obj.result
end sub


function add() as void
  m.result = m.a + m.b
end function


function cond()
  if(a=5) then
  else if(a=4) then
  else
  end if
end function


REM anonymous functions
function anon() as void
  myfunc = function (a, b)
    return a+b
  end function

  #const a = 5

  mysub = sub (a, b)
    return a+b
  end sub

  #if (a = 5)
  print myfunc(1,2)
#else if (a < 4)
next
#else
print mysub(1,2)
#end if

end function

function math()
  #error "Conditional error"
  x = 1 * 10
  x+=1
  ' x = 2
  x+=2
  ' x = 4
  x-=1
  ' x = 3
  x/=2

  m = a.subNode.top()

  x=9--
  x\=2
  ' x = 4 (integer divide)
  x*=3
  ' x = 12

  x=++1
  x<<=8
  ' x = 256
  x-=1
  ' x = 255
  x>>=4
  ' x = 15
end function


function dimStatement()

  dim c[5, 4, 6]
  for x = 1 to 5
    for y = 1 to 4
      for z = 1 to 6
        c[x, y, z] = k
        k = k + 1
      end for
    end for
  end for


  k=0
  for x = 1 to 5
    for y = 1 to 4
      for z = 1 to 6
        if c[x, y, z] <> k then print"error" : stop
        if c[x][y][z] <> k then print "error": stop
        k = k + 1
      end for
    end for
  end for
end function
