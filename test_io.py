import asyncio

async def ainput(prompt: str = '') -> str:
    # Simple async wrapper around input
    loop = asyncio.get_event_loop()
    return await loop.run_in_executor(None, input, prompt)

async def main():
    print("Hello! What's your name?", flush=True)
    name = await ainput()
    print(f"Nice to meet you, {name}!")

if __name__ == "__main__":
    asyncio.run(main())
