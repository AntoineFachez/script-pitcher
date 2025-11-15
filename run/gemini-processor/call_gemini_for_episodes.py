import json
import re
import google.generativeai as genai

# --- Gemini function for Episodes ---
def call_gemini_for_episodes(full_text, gemini_key):
    print("Sending text to Gemini for episode extraction...")
    
    if not gemini_key:
        print("Gemini API key not configured. Skipping episode extraction.")
        return []

    model = genai.GenerativeModel('gemini-2.5-pro')
    
    prompt = f"""
    You are an expert data extraction API. Your task is to analyze the following text from a script concept and extract all exemplary episode descriptions.
    These episodes are often listed under an "EXEMPLARISCHE FOLGEN" (EXEMPLARY EPISODES) heading.

    Please return *only* a valid JSON array. Each object in the array should represent one episode and follow this exact schema:
    {{
      "title": "The episode's title, usually in all-caps (e.g., 'CASINO HALAL')",
      "description": "A concise summary of the episode's plot."
    }}

    If no episodes are found in the text, return an empty array: [].
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

        print(f"Gemini response (episodes): {response_text[:200]}...")
        episode_data = json.loads(response_text)
        
        if isinstance(episode_data, list):
            print(f"Successfully extracted {len(episode_data)} episodes.")
            return episode_data
        else:
            print("Gemini did not return a list for episodes. Returning empty array.")
            return []
    except json.JSONDecodeError as json_err:
        print(f"Error: Failed to decode Gemini JSON response for episodes. Error: {json_err}")
        print(f"Raw response was: {response.text}")
        return []
    except Exception as e:
        print(f"Error calling Gemini API for episodes: {e}")
        return []