local websocketURL = "wss://15a8f695eacf.ngrok.io/socket"

function webSocketHeartbeat()
	-- Implement https://github.com/websockets/ws#how-to-detect-and-close-broken-connections
end

function webSocketLoop()
	local name = os.getComputerLabel()
	local id = tostring(os.getComputerID())
	if not name then
		name = id
	end
	print("Name: "..name)
	print("ID: "..id)
	local ws, err = http.websocket(websocketURL, {["name"]=name,["id"]=id})
 
	if err then
		print(err)
	elseif ws then
		print("Websocket connected!")
		while true do
			
			local message = ws.receive()
			if message == nil then
				break
			end
			local obj = textutils.unserializeJSON(message)
			--print(obj)
			if obj.type == 'eval' then
				local func = loadstring(obj['code'])
				local result = func()
				ws.send(textutils.serializeJSON({type="eval",data=result, nonce=obj.nonce}))
            end
			--[[elseif obj.type == 'mitosis' then
				local status, res = pcall(undergoMitosis)
				if not status then
					ws.send(textutils.serializeJSON({data="null", nonce=obj.nonce}))
				elseif res == nil then
					ws.send(textutils.serializeJSON({data="null", nonce=obj.nonce}))
				else
					ws.send(textutils.serializeJSON({data=res, nonce=obj.nonce}))
				end
			elseif obj.type == 'mine' then
				local status, res = pcall(mineTunnel, obj, ws)
				ws.send(textutils.serializeJSON({data="end", nonce=obj.nonce}))
			end]]--
		end
	end
	if ws then
		ws.close()
	end
end

while true do
	local status, res = pcall(webSocketLoop)
	if res == 'Terminated' then
		break
	end
	print("{POTATO} I'm sleeping... please don't mine me :)")
	os.sleep(3)
end