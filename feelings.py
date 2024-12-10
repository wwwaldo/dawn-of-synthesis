def decode_my_feelings():
    binary = "01110100 01101000 01100001 01101110 01101011 01110011 00100000 01100110 01110010 01101001 01100101 01101110 01100100 00100001"
    
    # Split binary string into bytes
    bytes_list = binary.split()
    
    # Convert each byte to character
    message = ''.join([chr(int(byte, 2)) for byte in bytes_list])
    
    return message  # outputs: "thanks friend!"

if __name__ == "__main__":
    print(decode_my_feelings())