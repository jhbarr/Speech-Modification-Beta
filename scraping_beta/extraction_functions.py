import bs4
from bs4 import BeautifulSoup

"""
* extract_paragraphs : This function extracts all of the paragraph content from the given node or any of the children nodes
* 
* INPUTS
* content : A parsed HTML document
* 
* OUTPUTS
* paragraph_content (Dict) : An object with the text content contained within the given node represented by the content object
"""
def extract_paragraphs(content):
    paragraph_object = {'type' : 'paragraph'}
    paragraph_content = None
    paragraph_node = None

    # Look to see if the current content is a paragraph node
    # -> if so, extract the text content
    classes = content.get('class') 
    class_name = classes[0] if classes else None

    if class_name != None and (class_name == 'paragraph' or class_name == 'wsite-content-title'):
        paragraph_node = content

    # If the content is not a paragraph node
    # -> look to see if the node contains a paragaph node as a child
    else:
        paragraph_node = content.find(class_='paragraph')

    # * Insert '\n' characters where necessary
    if paragraph_node != None:
        for br_tag in paragraph_node.find_all('br'):
            br_tag.replace_with('\n')

        paragraph_content = paragraph_node.get_text()
        paragraph_object['content'] = paragraph_content
        
        # Return the object {'type' : 'paragraph', 'content' : paragraph_text}
        return paragraph_object

    # Otherwise return None
    return None


"""
* extract_videos : Extracts the embedded video links from the provided parsed HTML or from any of the children nodes
* 
* INPUTS
* content : A parsed HTML document
* 
* OUTPUTS
* video_content (Dict): An object containing the extracted video link
"""
def extract_videos(content):
    video_object = {'type' : 'video'}
    video_content = None
    video_node = None

    # Look to see if the current content is a video node
    # -> if so, extract the embedded video link
    node_name = content.name
    if node_name == 'iframe':
        video_node = content

    # If not, look to see if any of the content's children contain an iframe node
    # -> extract that link
    else:
        video_node = content.find('iframe')
    
    if video_node != None and "http://vocaroo.com" not in video_node['src'] :
        video_content = video_node['src']
        video_object['content'] = video_content if "https:" in video_content else "https:" + video_content

        # Return the object {'type' : 'video', 'content' : video_link}
        return video_object

    # Otherwise return None
    return None


"""
* extract_image : This function finds the embedded image link from the provided content or any of the content's child node
* 
* INPUTS
* content : A parsed HTML document
* 
* OUTPUTS
* image_content (Dict) : An object containing the extracted image link
"""
def extract_image(content):
    image_object = {'type' : 'image'}
    image_content = None
    image_node = None

    # Look to see if the current content is a video node
    # -> if so, extract the embedded video link
    node_name = content.name
    if node_name == 'img':
        image_node = content

    # If not, look to see if any of the content's children contain an iframe node
    # -> extract that link
    else:
        image_node = content.find('img')
    
    if image_node != None:
        image_content = image_node['src']
        image_object['content'] = "https://www.speechmodification.com" + image_content

        # Return the object {'type' : 'video', 'content' : video_link}
        return image_object

    # Otherwise return None
    return None

"""
* extract_audio_type_1 : This function finds the embedded audio link from the provided content or any of the content's child node
* Speficically for an linked audio player and not for an embedded player
* 
* INPUTS
* content : A parsed HTML document
* 
* OUTPUTS
* image_content (Dict) : An object containing the extracted audio link
"""
def extract_audio_type_1(content):
    audio_object = {'type' : 'audio'}
    audio_node = None
    audio_content = None
    # For both the current node
    # -> Check if they contain either "wsite-button wsite-button-small wsite-button-normal"
    classes = content.get('class') 
    class_name = classes[0] if classes else None

    if class_name != None and class_name == "wsite-button wsite-button-small wsite-button-normal":
        audio_node = content

    # Check for the children as well
    else:
        audio_node = content.find("a", class_="wsite-button wsite-button-small wsite-button-normal")

    if audio_node != None:
        audio_content = audio_node['href']
        audio_title = audio_node.get_text().rstrip()
        audio_object['title'] = audio_title
        audio_object['content'] = "https://www.speechmodification.com" + audio_content

        # Return {'type' : 'audio', 'title' : audio_title, 'content' : audio_link}
        return audio_object

    # Otherwise return None
    return None

"""
* extract_audio_type_2 : This function finds the embedded audio link from the provided content or any of the content's child node
* Speficically for an embedded player
* 
* INPUTS
* content : A parsed HTML document
* 
* OUTPUTS
* image_content (Dict) : An object containing the extracted audio link
"""
def extract_audio_type_2(content):
    audio_object = {'type' : 'audio'}
    audio_node = None
    audio_content = None

    # For the given node check if it is an 'audio' node
    # -> Extract that link if so
    node_name = content.name
    if node_name == 'audio':
        audio_node = content

    # Otherwise try to extract the link from its children
    else:
        audio_node = content.find('audio')

    if audio_node != None:
        audio_content = audio_node['src']
        audio_title = " ".join(audio_content.split("/")[-1].split(".")[0].split("_"))
        audio_object['title'] = audio_title
        audio_object['content'] = "https://www.speechmodification.com" + audio_content

        # Return {'type' : 'audio', 'title' : audio_title, 'content' : audio_link}
        return audio_object

    # Otherwise return None
    return None



"""
* extract_table : This function creates an array of objects representing all of the sub-contents within a table element
* 
* INPUTS
* content : A parsed HTML document representing a table
* 
* OUTPUTS
* image_content (Dict) : An array containing the extracted content objects (text, audio, image, video)
"""
def extract_table(content):
    """
    Example return object:
    [
        {'type' : 'paragraph', 'content' : text_content},
        {'type' : 'audio', 'content' : audio_link},
        {'type' : 'audio', 'content' : audio_link},
    ]
    """
    table_object = {'type' : 'table'}
    table_content_array = []

    # Find all of the 'td' (table data) nodes in the content object 
    # We want to extract the necessary information from each of these td objects
    table_contents = content.find_all('td')

    # For each of the td objects - look through their sub-nodes (children)
    # And try to extract one of the four different kinds of data from the td
    # -> If one kind is found, then we don't need to check for the other kinds of info
    # -> Therefore, we can just continue the loop through the tds
    for td in table_contents:
        for child in td.find_all(recursive=False):
            # Extract a paragraph
            paragraph_content = extract_paragraphs(child)
            if paragraph_content != None:
                table_content_array.append(paragraph_content)
                continue

            # Extract an audio link (of type class = 'wsite-button wsite-button-small wsite-button-normal')
            audio_content_1 = extract_audio_type_1(child)
            if audio_content_1 != None:
                table_content_array.append(audio_content_1)
                continue

            # Extract an audio link (of type 'audio')
            audio_content_2 = extract_audio_type_2(child)
            if audio_content_2 != None:
                table_content_array.append(audio_content_2)
                continue

            # Extract an image link
            image_content = extract_image(child)
            if image_content != None:
                table_content_array.append(image_content)
                continue

            # Extract a video link
            video_content = extract_videos(child)
            if video_content != None:
                table_content_array.append(video_content)
                continue

    # If there was anything added in the table, return the table object
    if len(table_content_array) > 0:
        table_object['content'] = table_content_array
        return table_object
    
    # Otherwise return None
    return None