---
'@rocket.chat/meteor': patch
---

Fixes message links (`?msg=`) leaving public channels blank for anonymous readers when Allow Anonymous Read is enabled. Opening the same channel without the link already worked, but loading the messages around a linked message still required an authenticated user, so the room failed with an "Invalid user" error instead of opening.
