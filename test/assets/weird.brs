'*************************************************************
'** Utilities BrightScript
'**
'** 24i, 30-11-2016
'**
'** The utility functions in this file contain all BrightScript-related utility functionalities.
'** There is a separate utils file for SceneGraph-specific functionality.
'*************************************************************

'-----------------
' Print
'  * printl()
'  * printw()
'  * printe()
'
' Various
'  * utils_getAnonymisedDeviceId()
'  * utils_getLocalJSON()
'  * utils_encapsulateInQuotes()
'
' Registry
'  * utils_saveStringInRegistry()
'  * utils_loadStringFromRegistry()
'  * utils_deleteStringFromRegistry()
'
' URL and HTTP
'  * utils_HTTPRequest()
'  * utils_urlencode()
'  * utils_addQueryParamsToURL()
'  * utils_removeParameterFromURL()

' Array and AssociativeArray
'  * utils_array_indexOf()
'  * utils_array_contains()
'  * utils_array_findIndexByKeyAndValue()
'  * utils_subarray()
'  * utils_array_join()
'  * utils_shallowCopy()
'
' Date and time
'  * utils_httpDateToRoDateTime()
'  * utils_yyyyMMddhhmmssToDateTime()
'  * utils_secondsToReadableTime()
'
' Math
'  * utils_mathFloor()
'  * utils_mathCeil()
'  * utils_mathRound()
'-----------------


'===================================================================================================
' Print
'===================================================================================================

'-----
' printl()
' printw()
' printe()
'
' These functions offer a slightly shortened way to print LOG, WARNING and ERROR telnet log lines.
' The value of these functions is that they automatically add LOG/WARNING/ERROR and the name of the
' component from which they were called. You still need to add the function name to make it easy to
' find.
'
' Parameters:
' * {Object} messageObject - The message to be printed.
'
' Example:
' printl("init() - Setting up component."
' >>> "LOG - MainScene - init() - Setting up component." to be logged
'-----
Function printl(messageObject as Dynamic)
    printcommon("LOG", messageObject)
End Function

Function printw(messageObject as String)
    printcommon("WARNING", messageObject)
End Function

Function printe(messageObject as String)
    printcommon("ERROR", messageObject)
End Function

Function printcommon(messageTypeString as String, messageObject as Dynamic)
    if(m.top <> invalid)
        print messageTypeString + " - " + m.top.subtype().ToStr() + " - " ; messageObject
    else
        print messageTypeString + " - " ; messageObject
    end if
End Function


'===================================================================================================
' Various
'===================================================================================================

'-----
' utils_getAnonymisedDeviceId()
'
' Returns the first 16 characters of the SHA256 of the device ID, split in groups of 4 characters.
' For example: "9be4-1140-8faa-9a80". This can be used to uniquely identify a device.
'
' Returns:
' * {String} An anonymised identifier.
'-----
Function utils_getAnonymisedDeviceId() as String
    deviceInfo = CreateObject("roDeviceInfo")
    byteArray = CreateObject("roByteArray")
    byteArray.FromAsciiString(deviceInfo.GetDeviceUniqueId())
    evpDigest = CreateObject("roEVPDigest")
    evpDigest.Setup("sha256")
    anonymisedDeviceIdString = evpDigest.Process(byteArray).Mid(0, 16)
    splitAnonymisedDeviceIdString = anonymisedDeviceIdString.Mid(0,4) + "-" + anonymisedDeviceIdString.Mid(4,4) + "-" + anonymisedDeviceIdString.Mid(8,4) + "-" + anonymisedDeviceIdString.Mid(12,4)

    return splitAnonymisedDeviceIdString
End Function

'-----
' utils_getLocalJSON()
'
' This function reads JSON from a specified filePath and returns either a JSON string or a parsed
' JSON object.
'
' Parameters:
' * {String} filePath             - Path to a local JSON file
' * (optional) {Boolean} toParse  - if the JSON should be parsed or not
'
' Returns:
' * {String or roArray or roAssociativeArray} - Returns either the string or a parsed JSON object.
'                                             - Returns invalid if file was not found.
'-----
Function utils_getLocalJSON(filePath as String, toParse = false as Boolean) as Dynamic
    returnObject = invalid
    fileSystem = CreateObject("roFileSystem")

    'Load the file.
    if (fileSystem.exists(filePath) = true)
        JSONstring = ReadAsciiFile(filePath)
        if(toParse)
            'Parse the configuration file.
            parsedJSONObject = ParseJSON(JSONstring)
            if (parsedJSONObject <> invalid)
                returnObject = parsedJSONObject
            else
                printe("utils_getLocalJSON() - Parsing " + filePath + " returned invalid result.")
            end if
        else
            returnObject = JSONstring
        end if
    else
        printe("utils_getLocalJSON() - No file found at: " + filePath)
    end if
    return returnObject
End Function

'-----
' utils_encapsulateInQuotes()
'
' Utility function to encapsulate the given string in quotes.
'
' Parameters:
' * {String} encapsulate - The string to be encapsulated in quotes.
'
' Returns:
' * {String} A string encapsulated in quotes ("").
'
' Example:
' utils_encapsulateInQuotes("my string to encapsulate")
' >>> ""my string to encapsulate""
'-----
Function utils_encapsulateInQuotes(encapsulate as String) as String
    return Chr(34) + encapsulate + Chr(34)
End Function

'===================================================================================================
' Registry
'===================================================================================================

'-----
' utils_saveStringInRegistry()
' utils_loadStringFromRegistry()
' utils_deleteStringFromRegistry()
'
' Methods for easy access to the registry (write / read / delete).
' NOTE: In SceneGraph apps these can only be used from a Task node!
'
' Parameters:
' * {String} sectionString - The section
' * {String} keyString     - The complete url
' * {String} valueString   - The string to be saved.
'-----
Sub utils_saveStringInRegistry(sectionString as String, keyString as String, valueString as String)
    registrySection = CreateObject("roRegistrySection", sectionString)
    registrySection.Write(keyString, valueString)
    registrySection.Flush()
End Sub

Function utils_loadStringFromRegistry(sectionString as String, keyString as String) as Object
    registrySection = CreateObject("roRegistrySection", sectionString)
    if (registrySection.Exists(keyString))
        return registrySection.Read(keyString)
    else
        return invalid
    end if
End Function

Sub utils_deleteStringFromRegistry(sectionString as String, keyString as String)
    registrySection = CreateObject("roRegistrySection", sectionString)
    if (registrySection.Exists(keyString))
        registrySection.Delete(keyString)
        registrySection.Flush()
    end if
End Sub

Sub utils_deleteRegistrySection(sectionString as String)
    registry = CreateObject("roRegistry")
    registry.Delete(sectionString)
    registry.Flush()
End Sub

'===================================================================================================
' URL and HTTP
'===================================================================================================

'-----
' utils_HTTPRequest()
'
' A standard function to perform HTTP requests (GET, POST, PUT or DELETE) with optional extra HTTP
' headers.
'
' Parameters:
' * {String} httpMethodString          - The method (GET, POST)
' * {String} urlString                 - The complete url
' * {String or invalid} postBodyString - In case of HTTP POST, this should contain the HTTP body to
'                                        be posted. In case of HTTP GET, this should be 'invalid'.
' * {roAssociativeArray or invalid} headersAssociativeArray  - A associative array with the extra
'                                        headers. Should be invalid if no extra headers are needed.
'
' Returns:
' * {roAssociativeArray} resultObject - An associative array with:
'                                       .responseCode   - the code from message.GetResponseCode()
'                                       .failureReason  - the description from message.GetFailureReason()
'                                       .bodyString     - the response body from message.GetString()
'-----
Function utils_HTTPRequest(httpMethodString as String, urlString as String, postBodyString as Dynamic, headersAssociativeArray as Dynamic) as Object
    printl("utils_HTTPRequest() - " + httpMethodString + " " + urlString)

    'Before doing a request, check the availability of the internet connection.
    deviceInfo = CreateObject("roDeviceInfo")
    if (deviceInfo.GetLinkStatus() = false)
        printe("utils_checkNetworkConnection - deviceInfo.GetLinkStatus(): " + deviceInfo.GetLinkStatus())
    end if

    urlTransfer = CreateObject("roUrlTransfer")
    urlTransfer.SetMessagePort(CreateObject("roMessagePort"))
    urlTransfer.SetUrl(urlString)                                    'Set the url.
    urlTransfer.EnableEncodings(true)                                'Enable gzip compression.
    urlTransfer.RetainBodyOnError(true)                                'Also return the response body in case of errors.
    urlTransfer.SetCertificatesFile("common:/certs/ca-bundle.crt")  'Enable https.
    urlTransfer.InitClientCertificates()                            'Enable https.

    urlTransfer.EnableCookies()

    'Add any required HTTP headers.
    if (headersAssociativeArray <> invalid)
        urlTransfer.SetHeaders(headersAssociativeArray)
    end if

    if (httpMethodString = "POST" or httpMethodString = "PUT")
        if (httpMethodString = "PUT")
            urlTransfer.SetRequest("PUT")
        end if

        if (postBodyString <> invalid and postBodyString.Len() > 0)
            printl("utils_HTTPRequest() - postBodyString: " + postBodyString)
        end if

        urlTransfer.AsyncPostFromString(postBodyString)
    else
        if (httpMethodString = "DELETE")
            urlTransfer.SetRequest("DELETE")
        end if

        urlTransfer.AsyncGetToString()
    end if

    'Prepare the object that is to be returned.
    resultObject = CreateObject("roAssociativeArray")

    while true
        message = wait(0, urlTransfer.GetMessagePort())

        if (type(message) = "roUrlEvent")
            'printl("utils_HTTPRequest() - GetSourceIdentity():"; message.GetSourceIdentity())

            resultObject.responseCode = message.GetResponseCode()
            resultObject.failureReason = message.GetFailureReason()
            resultObject.bodyString = message.GetString()

            if (message.GetResponseCode() = 200 or message.GetResponseCode() = 201)
                'printl("utils_HTTPRequest() - GetString(): " + message.GetString())
                'printl("utils_HTTPRequest() - GetTargetIpAddress(): " + message.GetTargetIpAddress())
                'printl("utils_HTTPRequest() - GetResponseHeaders(): " + message.GetResponseHeaders())
                'printl("utils_HTTPRequest() - GetResponseHeadersArray(): " + message.GetResponseHeadersArray())
            else
                printl("utils_HTTPRequest() - GetResponseCode(): " + message.GetResponseCode())
                printl("utils_HTTPRequest() - GetFailureReason(): " + message.GetFailureReason())
                printl("utils_HTTPRequest() - GetString(): " + message.GetString())
            end if

            exit while
        end if
    end while

    return resultObject
End Function

'-----
' utils_urlencode()
'
' Utility function to URL encode a given string.
' See: 'https://sdkdocs.roku.com/display/sdkdoc/ifUrlTransfer#ifUrlTransfer-Escape(textasString)asString
'
' Parameters:
' * {String} query - The string that is to be url encoded.
'
' Returns:
' * {String} A URL encoded string.
'-----
Function utils_urlencode(query as String) as String
    urlTransfer = CreateObject("roUrlTransfer")

    return urlTransfer.Escape(query)
End Function

'-----
' utils_addQueryParamsToURL()
'
' Utility function to add query parameters to an URL. All values are URL encoded.
'
' Parameters:
' * {roAssociativeArray} params - An associative array with the parameters.
' * {String} url - The URL to which the parameters are to be added.
'
' Returns:
' * {String} A URL encoded string with given parameters included.
'-----
Function utils_addQueryParamsToURL(params as Object, url as String) as String
    for each param in params
        if (url.Instr("?") <> -1)
            url = url + "&"
        else
            url = url + "?"
        end if
        url = url + (utils_urlencode(param) + "=" +  utils_urlencode(params[param]))
    end for

    return url
End Function

'-----
' utils_removeParameterFromURL()
'
' Utility function to remove a query parameter from an URL.
' @see http://stackoverflow.com/questions/1634748/how-can-i-delete-a-query-string-parameter-in-javascript#answer-1634841

' Parameters:
' * {String} param - Parameter to be removed from the URL.
' * {String} url - URL to remove parameter from.
'
' Returns:
' * {String} URL string without given param.
'
' Examples:
' utils_removeParameterFromURL("someParam", "http://mysite.com?someParam=someValue")
' >>> http://mysite.com
' utils_removeParameterFromURL("someParam", "http://mysite.com?someParam=someValue&someOtherParam=someOtherValue")
' >>> http://mysite.com?someOtherParam=someOtherValue
' utils_removeParameterFromURL("someParam", "http://mysite.com?someParam=someValue&someOtherParam=someOtherValue&anotherParam=anotherValue")
' >>> http://mysite.com?someOtherParam=someOtherValue&anotherParam=anotherValue
'-----
Function utils_removeParameterFromURL(param as String, url as String)
    urlParts = url.Split("?")

    if (urlParts.Count() >= 2)
        prefix = utils_urlencode(param) + "="

        r = CreateObject("roRegex", "[&;]", "g")
        parts = r.Split(urlParts[1])

        ' reverse iteration as may be destructive
        for i = (parts.Count() - 1) to 0 step -1
            if (parts[i].Instr(0, prefix) <> -1)
                parts.Delete(i)
            end if
        end for

        if (parts.Count() > 0)
            url = urlParts[0] + "?" + utils_array_join(parts, "&")
        else
            url = urlParts[0]
        end if
    end if

    return url
End Function


'===================================================================================================
' Array and AssociativeArray
'===================================================================================================

'-----
' utils_array_indexOf()
'
' Utility function to return the location (or minus one (-1) if it's not in there) of a specific
' item in an array.
'
' Parameters:
' * {Object} needle - The item to look for.
' * {roArray} hayStack - The hayStack (array) where the needle should be looked for.
'
' Returns:
' * {Integer} An integer indicating what the location of the needle in  the hayStack (array) is. If
'             it's not in the array it'll return minus one (-1).
'-----
Function utils_array_indexOf(needle as Object, hayStack as Object) as Integer
    if (type(hayStack) <> "roArray")
        return -1
    end if

    for i = 0 to (hayStack.Count() - 1)
        if (type(hayStack[i]) = type(needle) and hayStack[i] = needle)
            return i
        end if
    end for

    return -1
End Function

'-----
' utils_array_contains()
'
' Utility function to check whether an array contains a specific item.
'
' Parameters:
' * {Object} needle - The item to look for.
' * {roArray} hayStack - The hayStack (array) where the needle should be looked for.
'
' Returns:
' * {Boolean} A boolean indicating whether the hayStack (array) contains the given needle (item).
'-----
Function utils_array_contains(needle as Object, hayStack as Object) as boolean
    if (type(hayStack) <> "roArray")
        return false
    end if
    return utils_array_indexOf(needle, hayStack) <> -1
End Function

'-----
' utils_array_findIndexByKeyAndValue()
'
' Utility function to find an item of an array searching for it on the given key and value.
'
' Parameters:
' * {String} key - The key to check for
' * {Dynamic} value - The value to check for.
' * {roArray or roAssociativeArray} hayStack - The hayStack (array containing associative array's)
'                                              where the needle should be looked for.
'
' Returns:
' * {Integer} An item that matches the given key and value in the hayStack (array) or -1.
'-----
Function utils_array_findIndexByKeyAndValue(key as String, value as Dynamic, haystack as Object) as Integer
    if (type(hayStack) <> "roArray")
        return -1
    end if

    for i = 0 to haystack.Count() - 1
        hay = hayStack[i]
        if (type(hay) = "roAssociativeArray" and hay[key] <> invalid and value <> invalid and hay[key] = value)
            return i
        end if
    end for

    return -1
End Function

'-----
' utils_subarray()
'
' This function is used to get part of an array (similar to the functionalities in ifStringOps).
'
' Parameters:
' * {roArray} originalArray - the target array.
' * {Integer} startIndex - the start of the part of the array we want.
' * {Integer} endIndex - the end of the part of the array we want.
'
' Returns:
' * {roArray} - The sub array.
'-----
Function utils_subarray(originalArray as Object, startIndex as Integer, endIndex as Integer) as Dynamic
    'Validate the startIndex and endIndex.
    if (startIndex < 0 or endIndex < 0 or startIndex > (originalArray.Count() - 1) or endIndex > (originalArray.Count() - 1) or endIndex < startIndex)
        return []
    end if

    'Once validate, create and fill the subArray.
    subArray = CreateObject("roArray", 0, true)
    for i = startIndex to endIndex
        subArray.Push(originalArray[i])
    end for

    return subArray
End Function

'-----
' utils_array_join()
'
' Utility function to join all elements of an array into a string.
'
' Parameters:
' * {roArray} array - The array which elements should be joined into a string.
' * (optional) {String} [separator] - A string to be used to separate the items.
'
' Returns:
' * {String} A joined string containing all elements of the given array. Or an empty string if no
'            array is given as the first parameter.
'
' Examples:
' utils_array_join(["el1", "el2", "el3"])
' >>> "el1el2el3"
' utils_array_join(["el1", "el2", "el3"], ", ")
' >>> "el1, el2, el3"
'-----
Function utils_array_join(array as Object, separator = "" as String)
    if (GetInterface(array, "ifArray") = invalid)
        return ""
    end if

    joinedString = CreateObject("roString")

    max = array.Count() - 1

    for i = 0 to max
        if (i = max)
            separator = ""
        end if

        toAppend = array[i] + separator

        joinedString.AppendString(toAppend, Len(toAppend))
    end for

    return joinedString
End Function

'-----
' utils_shallowCopy()
'
' Utility function to make a copy of an array or associative array.
' Taken from: https://forums.roku.com/viewtopic.php?p=392505&sid=80748067620a1a2d1c06c65f4ecab91d#post_content392575
'
' Parameters:
' * {roArray or roAssociativeArray} array - The array or associative array to copy.
' * (optional) {Integer} [depth] - The depth to use for associative arrays. Defaults to 0 if not
'                                present.
'
' Returns:
' * {roArray or roAssociativeArray} A copy of the given (associative) array.
'-----
Function utils_shallowCopy(array As Dynamic, depth = 0 As Integer) As Dynamic
    if (Type(array) = "roArray") Then
        copy = []
        for each item In array
            childCopy = ShallowCopy(item, depth)
            if (childCopy <> invalid) Then
                copy.Push(childCopy)
            end if
        next
        return copy
    else if (Type(array) = "roAssociativeArray") Then
        copy = {}
        for each key In array
            if (depth > 0) Then
                copy[key] = ShallowCopy(array[key], depth - 1)
            else
                copy[key] = array[key]
            end if
        next
        return copy
    else
        return array
    end if
    return invalid
End Function


'===================================================================================================
' Date and time
'===================================================================================================

'-----
' utils_httpDateToRoDateTime()
'
' Utility function to convert an HTTP Date string to a roDateTime object.
' An example of such an HTTP Date is "Date: Tue, 15 Nov 1994 08:12:31 GMT".
' * see: https://tools.ietf.org/html/rfc822#page-26
' * see: https://forums.roku.com/viewtopic.php?t=46484
'
' Parameters:
' * {String} httpDate - An HTTP Date string.
'
' Returns
' * {roDateTime} A 'roDateTime' object based on the given HTTP Date.
'-----
Function utils_httpDateToRoDateTime(httpDate as String) as Object
    dateInString = httpDate
    regex = CreateObject("roRegex", "(\d+)\s+([a-z]+)\s+(\d+)\s+(\d+:\d+:\d+)\D", "i")
    da = regex.Match(dateInString)
    ml = "JANFEBMARAPRMAYJUNJULAUGSEPOCTNOVDEC"
    mon% = (Instr(1, ml, Ucase(da [2])) - 1) / 3 + 1
    dateOutString = da[3] + "-" + mon%.ToStr() + "-" + da [1] + " " + da [4]

    dateTime = CreateObject("roDateTime")
    dateTime.fromISO8601String(dateOutString)
    return dateTime
End Function

'-----
' utils_yyyyMMddhhmmssToDateTime()
'
' Utility function to convert a yyyyMMddhhmmss string to a `roDateTime` object.
'
' Parameters:
' * {String} yyyyMMddhhmmss - A date time string in the yyyyMMddhhmmss format.
'
' Returns:
' * {roDateTime} A 'roDateTime' object set to the given timestamp.
'-----
Function utils_yyyyMMddhhmmssToDateTime(yyyyMMddhhmmss as String) as Object
    year = yyyyMMddhhmmss.Left(4)
    month = yyyyMMddhhmmss.Mid(4, 2)
    day = yyyyMMddhhmmss.Mid(6, 2)
    hours = yyyyMMddhhmmss.Mid(8, 2)
    minutes = yyyyMMddhhmmss.Mid(10, 2)
    seconds = yyyyMMddhhmmss.Right(2)

    ' An ISO 8601 date string should look like for example "YYYY-MM-DD HH:MM:SS" e.g
    ' "2009-01-01 01:00:00.000" or "2009-01-01T01:00:00.000".
    dateString = year + "-" + month + "-" + day + " " + hours + ":" + minutes + ":" + seconds + ".000"

    dateTime = createObject("roDateTime")
    dateTime.FromISO8601String(dateString)

    return dateTime
End Function

'-----------------------------
' utils_secondsToReadableTime()
'
' Utility function to transform a number of seconds into a readable string.
' Works up to the level of hours, so primarily intended for showing the length of a video, trailer,
' etc.
'
' Parameter:
' * {Integer} secondsInteger - the number of seconds as an integer
'
' Returns:
' * {String} A human readable string with the amount of time
'
' Examples:
' utils_secondsToReadableTime(1)
' >>> 0:01
' utils_secondsToReadableTime(10)
' >>> 0:10
' utils_secondsToReadableTime(80)
' >>> 1:20
' utils_secondsToReadableTime(630)
' >>> 10:30
' utils_secondsToReadableTime(3670)
' >>> 1:01:10
' utils_secondsToReadableTime(90000)
' >>> 25:00:00
'-----------------------------
Function utils_secondsToReadableTime(secondsInteger as Integer) as String
    numberOfSeconds = secondsInteger MOD 60
    numberOfMinutes = secondsInteger MOD 3600 \ 60
    numberOfHours = secondsInteger \ 3600

    secondsString = numberOfSeconds.toStr()
    if (numberOfSeconds < 10)
        secondsString = "0" + secondsString
    end if

    minutesString = numberOfMinutes.toStr()
    if (numberOfMinutes < 10 and numberOfHours > 0)
        minutesString = "0" + minutesString
    end if

    hoursString = numberOfHours.toStr()

    if (numberOfHours > 0)
        return hoursString + ":" + minutesString + ":" + secondsString
    else
        return minutesString + ":" + secondsString
    end if
End Function


'===================================================================================================
' Math
'===================================================================================================

'-----
' utils_mathFloor()
'
' Utility function to return the largest integer less than or equal to a given float number.
'
' Parameters:
' * {Float} x - A number.
'
' Returns:
' * {Integer} A number representing the largest integer less than or equal to the specified number.
'
' Examples:
' utils_mathFloor(45.95)
' >>> 45
' utils_mathFloor(45.05)
' >>> 45
' utils_mathFloor(4)
' >>> 4
' utils_mathFloor(-45.05)
' >>> -46
' utils_mathFloor(-45.95)
' >>> -46
'-----
Function utils_mathFloor(x as Float) as Integer
    return Int(x)
End Function

'-----
' utils_mathCeil()
' Utility function to return the smallest integer greater than or equal to a given float number.
'
' Parameters:
' * {Float} x - A number.
'
' Returns:
' * {Integer} The smallest integer greater than or equal to the given number.
'
' Examples:
' utils_mathCeil(0.95)
' >>> 1
' utils_mathCeil(4)
' >>> 4
' utils_mathCeil(7.004)
' >>> 8
' utils_mathCeil(-0.95)
' >>> -0
' utils_mathCeil(-4)
' >>> -4
' utils_mathCeil(-7.004)
' >>> -7
'-----
Function utils_mathCeil(x as Float) as Integer
    return Int(x) + 1
End Function

'-----
' utils_mathRound()
'
' Utility function to return the value of a float number rounded to the nearest integer.
'
' Parameters:
' * {Float} x - A number.
'
' Returns:
' * {Integer} The value of the given number rounded to the nearest integer.
'
' Examples:
' utils_mathRound(20.49)
' >>> 20
' utils_mathRound(20.5)
' >>> 21
' utils_mathRound(42)
' >>> 42
' utils_mathRound(-20.5)
' >>> -20
' utils_mathRound(-20.51)
' >>> -21
'-----
Function utils_mathRound(x as Float) as Integer
    return Cint(x)
End Function
