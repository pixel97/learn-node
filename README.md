# Basics

Node.js has several libraries (i.e. packages) we can use for development. In order to utilize installed libraries we use import or require a module in our code. For example:
    
    const http = require('http')

Once you have node installed, you can run your Javascript code from the terminal using commands. As mentioned earlier we can install libraries for development purposes. As an example, consider the following Node script.
As an example, consider a basic web server 'basics/helloserver.js'.

**For you to do**:

1. Run the server ($ node basics/helloserver.js)

2. Scripts can be explicitly told to execute with Node by adding a shebang at the beginning of a script file. We can add a shebang which contains the path to node (e.g. #! /path/where/node_is_installed). 
Edit helloserver.js by adding the shebang at the top of the script and run it as /path/to/helloserver.js. 

3. When you make changes to your code, you will have to restart the program. Make a change to your web server and see if it gets reflected without restarting the server.

4. Having to restart your program for every change you make can be annoying, especially for server scripts. So, to address this issue we can install the nodemon module with the following command:

    `$ npm i -g nodemon`

    This will install nodemon globally which will give you access to the command nodemon. As a general rule, avoid doing global install of npm packages if you do not require a module across different applications. The nodemon package will be used for every node application you develop, so it makes sense here. 

5. Once nodemon is installed, run the server using the command shown below. Make changes and verify the changes are reflected.

    `$ nodemon /path/to/helloserver.js`

**Useful Node JS Objects**

The process module is useful for reading arguments passed to a script from the command line. Arguments are stored in an array called process.argv. process.argv[0] and process.argv[1] is the path to node.js and the script respectively.
Answer the following questions based on "basics/foo.js":

1. Run foo.js with the following command line argument and record the output.

    `$ node foo.js hello 'I am' "an argument"`

    Output : 
    /opt/homebrew/Cellar/node/21.1.0/bin/node
    /Users/anushkajain/Downloads/learn-node-main/basics/foo.js
    hello
    I am
    an argument

2. Modify "basics/foo.js" such that all arguments except the Node path and the script path are logged.

   Output:
   hello
   I am
   an argument


# Block and Non Blocking Operations

The NodeJS standard library has several operations that are called blocking operations. A blocking operation does allow execution to proceed unless the operation has finished. Examples of blocking operations are I/O operations, database connection operations, etc. Since Node JS has an event loop that runs on a single thread, running blocking operations that take time to finish degrades throughput of the server. Therefore, the standard library also has non-blocking versions of these operations. Based on the problem at hand, one may choose to use a blocking or non-blocking operation. 

**For you to do**:

1. Explore the code in "operations/blocking.js" and "operations/nonblocking.js". For which code will the function moreWork() get executed. Why?

In both pieces of code, moreWork() will be executed, but in the non-blocking scenario, it will happen before the file read operation is completed, while in the blocking scenario, it will happen after the file read operation is completed.

One must be careful when writing concurrent scripts in Node.js. If actions performed in later stages are related to actions related in previous stages or vice-versa then the program will be in an error state. 
For example, consider the code in "operations/syncdelete.js".

**For you to do**:

1. Identify and fix the runtime error in "operations/syncdelete.js".

The file is getting deleted asynchronously, while the file is getting read. To fix the code unlinkSync wih unlink and move the code inside the function.

# Event Loop

When *setTimeout(callback, ms)* invoked, Node puts a *callback* in the timer phase's queue. The Node runtime executes it after a threshold time as specified in the *ms* argument.

**For you to do**:

1. In "eventloop/timer.js", what will be the order of execution?

    Output: 
    foo
    baz
    foo
    baz
    2 : bar
    1 : bar

2. How many callbacks will the timers phase queue have after the script is run? 

There will be two callbacks in the timers phase queue for bar(1) and bar(2).

All I/O operations (e.g., read a file) run in the poll phase. The poll phase performs an I/O operation and puts all callbacks associated with the I/O operation in its queue. When the I/O operation completes, it executes the callbacks in the queue. 

**For you to do**:
1. In "eventloop/poll.js", which phase of the event loop will contain callback functions? What will they be?
    The fs.readFile function is an asynchronous I/O operation. Its callback function will be queued in the poll phase of the event loop after the file I/O operation has been completed.

2. What will be the execution order?

    someAsyncOperation() is called. This begins the file read operation.
    Immediately, foo() is called, which logs 'foo'.
    console.log('done') is executed, logging 'done'.


The poll phase is actually a blocking phase. If the callback queue associated with it is empty, it blocks the event loop till the earliest scheduled callback in the timers queue.

**For you to do**:
1. Run the script "eventloop/poll_timer.js". Explain the order of execution in terms of the messages you see in the console.

    Output will be as follows:
    someAsyncOperation
    103ms have passed since I was scheduled

    The program starts with someAsyncOperation() which starts reading the file.
    Immediately setTimeOut() is executed and starts 100ms timer.
    Before 100ms is completed file read is completed and event is put in poll queue.
    Now poll queue will execute other someAsyncOperation logging "someAsyncOperation".
    This in turn waits for 10ms and is blocking the queue to complete.
    After this setTimeOut() will execute and logs 104ms.

2. Change "Date.now() - startCallback < 10" in line 21 to "Date.now() - startCallback < 150". Will the order of execution change?
    Output will be:
    someAsyncOperation
    154ms have passed since I was scheduled

    The order of execution will not change as event loop will be blocked for 150ms instead of 10ms.

3. Set timeout to 0. Will the order of execution change?
    Output will be:
    3ms have passed since I was scheduled
    someAsyncOperation

    Yes, the order of execution will change now. As the timeOut() is set to zero, it will get executed. It goes to the poll queue and excute someAsyncOperation and logs it.


**For you to do**:
1. Run the script in "eventloop/immediate.js". What order of execution do you see in terms of the messages being logged.

    Output will be as follows:
    <Buffer 54 68 65 20 70 6f 6c 6c 20 70 68 61 73 65 20 69 73 20 61 63 74 75 61 6c 6c 79 20 61 20 62 6c 6f 63 6b 69 6e 67 20 70 68 61 73 65 2e 20 49 66 20 74 68 ... 861 more bytes>
    I was scheduled to run immediately
    6ms have passed since I was scheduled

2. Change the script such that the immediate callback runs first.
    Put the setImmediate() functions outside the file read function.

The *process.nextTick()* API allows us to schedule tasks before the event loop.

**For you to do**:
1. Run the script "eventloop/tick_immediate.js". Explain the order of execution in terms of the messages logged.
    Output is as follows:
    main = 0
    nextTick = 1
    Run Immediately = 1

2. Run the script "eventloop/starve.js". Why doesn't setTimeout get executed? 
    In the script process.nextTick will get priority before setTimeout. And as we can see
    process.nextTick is being called recursively and this never stops.

3. How does the output change if we replace process.nexTick(cb) with setImmediate(cb)?
    Output will be as follows:
    Start
    setTimeout executed
    
4. Why does the script "eventloop/eventemit.js" not log the event message? Change it such that the event message gets logged.
    The "eventloop/eventemit.js" not log the event message because the event is emitted in constructor
    before the listener is attached to it. To log it, emit the message in process.nextTick().


## Asynchronous Programming

The script in "asynchronous/callback.js" enables asynchronous behavior by scheduling a callback using the timer phase.
The script logs 0.

**For you to do**:

1. Change the script such that logs the sum of the elements in the list concatenated list.
2. Does the code look unweildy to you?

### Promise

**For you to do**:

1. Run the script in "asynchronous/promise.js". Explain the order of execution based on the logged messages.
2. Change the value of i to 12. How does it change the promise's execution?
3. Run the script in "asynchronous/promise1.js". Explain the order of execution based on the logged messages.
4. Do promises run before or after process.nextTick()?
5. Run the script in "asynchronous/promise2.js". Explain the order of execution based on the logged messages.
6. Discuss the implications of running a computationally expensive task in a promise.

Read more about Promises [here](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Using_promises#common_mistakes).

### Async and Await

**For you to do**:
1. The code in "asynchronous/asyncawait_timer.js" is quite hard to read. Rewrite it using async/await.
2. Explore the difference between sequentialStart, concurrentStart, concurrentPromise, and parallel in "asynchronous/concurrency.js".


# Further Reading:
-	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function#async_functions_and_execution_order
-	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/async_function
-	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/await
-	https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise
