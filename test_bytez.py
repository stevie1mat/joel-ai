from bytez import Bytez
import os

key = "REMOVED"
print(f"Testing Bytez with key: {key}")

try:
    client = Bytez(key)
    model = client.model("google/imagen-4.0-generate-001")
    
    prompt = "A mystical, amber-lit chamber adorned with ancient runes"
    print(f"Generating image for prompt: {prompt}")
    
    result = model.run(prompt)
    print(f"Raw Result Type: {type(result)}")
    print(f"Raw Result: {result}")

except Exception as e:
    print(f"Exception: {e}")
