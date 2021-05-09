local INVENTORY_SIZE = 16
local args={...}



function scanInventory()
    for i = 1, INVENTORY_SIZE do
        local slot = turtle.getItemDetail(i)
        if not slot then print("[" .. i .. "] " .. "No item")
        else
            print(("[" .. i .. "] " .. "%s"):format(item.name))
        end
    end 
end



function attemptRefuel()
    INVENTORY_SIZE = 16
    for i = 1, INVENTORY_SIZE do
        turtle.select(i)
        turtle.refuel()
    end
    turtle.select(1)
    turtle.refuel()
end

function rotateLeft(amount)
    if amount then
        for i = 1, times do
            turtle.turnLeft()
        end
    else
        turtle.turnLeft()
    end
end

function rotateRight(amount)
    if amount then
        for i = 1, times do
            turtle.turnRight()
        end
    else
        turtle.turnRight()
    end
end

-- MOVE TO --

function moveForward(times)
    if times then
        for i = 1, times do
            while not turtle.forward() do
                turtle.dig()
            end
        end
    else
        while not turtle.forward() do
            turtle.dig()
        end
    end
end

function moveUp(times)  
    if times then
        for i = 1, times do
            while not turtle.up() do
                turtle.digUp()
            end
        end
    else
        while not turtle.up() do
            turtle.digUp()
        end
    end
end

function moveDown(times)  
    if times then
        for i = 1, times do
            while not turtle.down() do
                turtle.digDown()
            end
        end
    else
        while not turtle.down() do
            turtle.digDown()
        end
    end
end

-- destination needs to be a vector.
function moveTo(destination)

    local startPos = 0
    local currPos = 0

    if gps.locate(2 , false) then
        startPos = vector.new(gps.locate(2 , false))
        currPos = startPos

        -- move down
        if currPos.y > destination.y then
            while currPos.y ~= destination.y do
                moveDown()
                currPos = vector.new(gps.locate(2 , false))
            end
        else
            -- move up
            while currPos.y ~= destination.y do
                moveUp()
                currPos = vector.new(gps.locate(2 , false))
            end
        end

        turtle.forward()
        currPos = vector.new(gps.locate(2 , false))
        local difference = startPos - currPos
        local moving = ""
        if difference.x == -1 then
            moving = "east"
        elseif difference.x == 1 then
            moving = "west"
        end

        if difference.z == -1 then
            moving = "south"
        elseif difference.z == 1 then
            moving = "north"
        end

        -- face west
        if currPos.x > destination.x then
            if moving == "south" then
                turtle.turnRight()
            elseif moving == "north" then
                turtle.turnLeft()
            elseif moving == "east" then
                turtle.turnRight()
                turtle.turnRight()
            end
            moving = "west"

            while currPos.x ~= destination.x do
                moveForward()
                currPos = vector.new(gps.locate(2 , false))
            end
        else
            -- face east
            if moving == "south" then
                turtle.turnLeft()
            elseif moving == "north" then
                turtle.turnRight()
            elseif moving == "west" then
                turtle.turnRight()
                turtle.turnRight()
            end
            moving = "east"

            while currPos.x ~= destination.x do
                moveForward()
                currPos = vector.new(gps.locate(2 , false))
            end
        end

        -- face north
        if currPos.z > destination.z then
            if moving == "south" then
                turtle.turnRight()
                turtle.turnRight()
            elseif moving == "west" then
                turtle.turnRight()
            elseif moving == "east" then
                turtle.turnLeft()
            end
            moving = "north"

            while currPos.z ~= destination.z do
                moveForward()
                currPos = vector.new(gps.locate(2 , false))
            end
        else
            -- face south
            if moving == "north" then
                turtle.turnRight()
                turtle.turnRight()
            elseif moving == "west" then
                turtle.turnLeft()
            elseif moving == "east" then
                turtle.turnRight()
            end
            moving = "south"

            while currPos.z ~= destination.z do
                moveForward()
                currPos = vector.new(gps.locate(2 , false))
            end
        end 

    else
        print("Error: unable to recieve gps")
        return
    end
end


-- moveTo(vector.new(args[1], args[2], args[3]))
