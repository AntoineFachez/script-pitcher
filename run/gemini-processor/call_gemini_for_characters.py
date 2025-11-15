import json
import re
import google.generativeai as genai

# --- Gemini function for Characters ---
def call_gemini_for_characters(full_text, gemini_key):
    print("Sending text to Gemini for character extraction...")
    
    if not gemini_key:
        print("Gemini API key not configured. Skipping character extraction.")
        return []

    model = genai.GenerativeModel('gemini-2.5-pro')
    
    prompt = f"""
    You are an expert data extraction API. Your task is to analyze the following text from a script concept and extract all character descriptions.
    The characters are often listed under a "FIGUREN" (CHARACTERS) heading.

    Please return *only* a valid JSON array. Each object in the array should represent one character and follow this exact schema:
    {{
      "name": "The character's full name and age, if provided (e.g., 'MARIE MERCURE (41)')",
      "archetype": "The character's archetype, often in italics (e.g., '*The Logical Smart One*'). If not present, use null.",
      "deckname": "The character's codename, usually prefixed with 'Deckname:' (e.g., 'Meister Propper'). If not present, use null.",
      "description": "A concise summary of the character's detailed description."
    }}

    If no characters are found in the text, return an empty array: [].
    Do not include any other text, explanations, or markdown formatting like ```json ... ``` in your response.

    Here is the text content to analyze:
    ---
    {full_text}
    ---
    """

    try:
        response = model.generate_content(
            prompt,
            generation_config=genai.types.GenerationConfig(
                response_mime_type="application/json"
            )
        )
        response_text = response.text.strip()
        
        if response_text.startswith("```json"):
            response_text = re.sub(r"^```json\s*|\s*```$", "", response_text, flags=re.MULTILINE)

        print(f"Gemini response (characters): {response_text[:200]}...")
        character_data = json.loads(response_text)
        
        if isinstance(character_data, list):
            print(f"Successfully extracted {len(character_data)} characters.")
            return character_data
        else:
            print("Gemini did not return a list for characters. Returning empty array.")
            return []
    except json.JSONDecodeError as json_err:
        print(f"Error: Failed to decode Gemini JSON response for characters. Error: {json_err}")
        print(f"Raw response was: {response.text}")
        return []
    except Exception as e:
        print(f"Error calling Gemini API for characters: {e}")
        return []