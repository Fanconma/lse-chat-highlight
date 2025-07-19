# Chat Highlight
A simple plugin to highlight specific keywords in chat for LeviLamina - the LSE engine!

# Installation
You can simply download the `.js` file and place it to your `plugins` folder.
Alternatively, you can use the following command:
```
lip install github.com/Fanconma/lse-chat-highlight
```

# Usage
After the plugin runs for the first time, it will generate two files in its directory: `config.json` and `player_data.json`

You can edit Configuration file to customize your experince.

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

    // If players can use commands to add/remove highlight keywords. Set to true will register the "highlight" command.
    "command_registration": true,
    // If players can see edited message including highlighted keywords. Set to false will show normal messages, even if the keywords are mentioned.
    "enable_chat_highlight": true,

    // If true, the name of player themself will be regarded as a highlight keyword. (Other players name will not be regarded)
    "selfname_as_highlight": true,
    // Global highlight keywords. All players will be highlighted if the message contains these keywords.
    // Players cannot remove these keywords.
    "keywords": [
        "thisisakeyword",
        "anotherkeyword"
    ],
    // The mention sound if highlight keyword is mentioned. set to an empty string to disable the sound.
    "mention_sound": "note.bell"
}
```

# Contribution
Feel free to open an issue to discuss!
Also, if you want to help us translate to your language, fork it! ;)
