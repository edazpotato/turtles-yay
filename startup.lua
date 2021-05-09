-- Password protection

local password = "uwu"

while true do
    write("\nEnter the password.\n")
    write("$ ")
    local attempt = read("*")
    if attempt == password then break end
    write("Incorrect.")
end
write("Access granted.\n")

-- zade move to mining turtle dir pls


