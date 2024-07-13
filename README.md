# electronic Jam Timer (eJT)

React Native Jam Timer app for WFTDA Flat Track Derby

Very much still a work in progress.

The app currently has two views, which can be toggled between using buttons at the top of the app.

Jam Timer view:

- This is the main view with the primary functionality of the app. It keeps both a period clock timer and second timer, which displays either time remaining in a jam, lineup time until the next jam, or the length of time elapsed in a timeout.
- There are also two buttons:
  - The first button changes the game state based on game activity - during a jam, it is used to end the jam and start lineup time; during lineup time it is used to start a timeout; and during a timeout it is used to end the timeout and start the next jam.
  - The second button either pauses or resets the app. When the app is active (jam, lineup, or timeout state), the button reads 'pause', and clicking it will halt all clocks and freeze the game state. Once paused, the first button will 'resume', picking up where paused. If the app is in the paused state, in the initial state before starting the first jam, or in an intermission state after the period clock has expired, the second button will 'reset' the app to its initial state (game clock reset, game paused, first button will start the first jam).

At the end of lineup time or if a jam runs the full jam time (default/WFTDA rules: 2 minutes), the timer automatically progresses into lineup time or the next jam respectively. During lineup time when the period clock has reached 0, the app goes into Intermission mode, meaning the app must be 'reset' using the reset button for it to be used further.

Configuration view:
This view is used to change the amount of time for each of the period clock (default 30 minutes), jam clock (default 2 minutes), and lineup clock (default 30 seconds).
