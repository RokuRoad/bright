function f1()
    'empty function
end function

function f2()
    'empty function
end function


function f3() as void
    'empty function
end function

function f4() as dynamic
    return {}
end function

function f5() as integer
    return 5
end function

function f6(p1 as integer) as integer
    return 5 + p1
end function

function f6(p1 = 5 as integer) as integer
    return 5 + p1
end function