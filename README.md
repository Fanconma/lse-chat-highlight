# Chat Highlight
A simple plugin to highlight specific keywords in chat for LeviLamina - the LSE engine!
<img width="1216" height="181" alt="image" src="https://github.com/user-attachments/assets/67cf291a-de09-449f-879b-f9f3323f0cb6" />


# Installation
You can simply download the `.js` file and place it to your `plugins` folder.
Alternatively, you can use the following command:
```
lip install github.com/Fanconma/lse-chat-highlight
```

# Usage
After the plugin runs for the first time, it will generate two files in its directory: `config.json` and `player_data.json`

You can edit Configuration file to customize your experience.

## commands:
- /highlight add \<keyword\> : Adds a keyword to your highlight list.
- /highlight remove \<keyword\> : Remove an existing keyword from your list.
- /highlight remove_all : Remove all of your keywords.
- /highlight list : List all of your keywords.
- /highlight help : Show the help message.
NOTE: These commands only affect your personal keywords. Global keywords can be managed in the `config.json` file.

If another player's message contains one of your keywords, the keyword will be highlighted for you, and a sound will play to alert you. :)

# `config.json`
```json
{
    // The configuration file version. Do not change this unless you know what you are doing.
    "config_version": 1,

    // The plugin language. Available langs: "en_US", "zh_CN".
    "lang": "en_US",

    // Allows players to use commands to manage their personal keywords. Set to true to register the "/highlight" command.
    "command_registration": true,
    // Enables keyword highlighting in chat. If set to false, messages will appear as normal, even if they contain keywords.
    "enable_chat_highlight": true,

    // If true, your own username is automatically treated as a highlight keyword.
    "selfname_as_highlight": true,
    // Global highlight keywords. All players will be highlighted if the message contains these keywords.
    // Players cannot remove these keywords using commands.
    "keywords": [
        "thisisakeyword",
        "anotherkeyword"
    ],
    // The sound that plays when a keyword is highlighted. Set to an empty string "" to disable the sound.
    "mention_sound": "note.bell"
}
```

# Contribution
Feel free to open an issue to start a discussion!
Also, if you'd like to help translate the plugin into your language, please fork the repository! ;)
