function run(steps)
    for i = 1, steps do
        if turtle.inspectUp() then
            turtle.digUp
        end
        if turtle.inspect() then
            turtle.dig()
            turtle.forward()
        else
            turtle.forward()
        end
    end
end