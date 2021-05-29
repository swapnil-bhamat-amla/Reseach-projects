# reArtifi CLI Tool


reArtifi (re-artifi) is a command line tool to configure and create new artifi based component.


### Prerequisite

1.  NodeJS - [https://nodejs.org/en/](https://nodejs.org/en/)
    
2.  GIT - [https://git-scm.com/download/win](https://git-scm.com/download/win) 

### Installation

Install artifi CLI globally using npm

    npm i -g @artifi/re-artifi --registry http://172.16.100.120:4873

> Note: --registry
> [http://172.16.100.120:4873](http://172.16.100.120:4873) is local Amla
> server which is not accessible outside of Amla campus

  
  

Open CMD/Terminal and run `re-artifi` to check whether CLI tool is installed successfully or not.

![](https://lh6.googleusercontent.com/Xqbu5J1I7ZniBvLn6wwChpsfJnqoHjB2wwHosvlyY9pSarz3vXH7wHM-Gpi5uK6xqzh_EcbdaqA-1QPjO8dmCTRvJlvsgKew6Vw3jjhr3jwoKip95ZYDzcHt6rdHrKzmaTjhApCD)

If you didn't get this result then reinstall re-artifi cli.

### Initializing Artifi Mono repo

Run `re-artifi init` or select Initialize option after `re-artifi` command

This command will install global dependencies and setup artifi-components monorepo.

  

List of global dependencies

1.  **Lerna** - npm install -g lerna
    
2.  **Create React App** - npm install -g create-react-app
    

  

Artifi-components - It is a mono repo projects which include all artifi components project in packages directory

  

![](https://lh3.googleusercontent.com/k9_zCBwVhj8VZfSsMQztX_Z1RvIYiAPJDHbEUS3WZ03CXaZSsdtynWBCXoXJvEci2WKnqVnT9ceTmCre52RTz_Hxq7sfyW2bSKM68uIILguZHziDgFz-pxCUa9beXD2r-ZqZjBf4)

  

![](https://lh4.googleusercontent.com/G4oOuMS6eEmArTozRe7-Q7sJRL8rQ0iyM7nSJqPIuXEG1IRIh1YbpyufDtgxFzaPzR6LV13cEDU_7VOtqf5puW5J0LLQC1fRgJX5fhzK6pdcTIZDfhVUabWpXv7O8in_CSa2h2EL)

  

### Creating new component

  

To create new component project open cmd and change directory to packages folder and run `re-artifi "Create new component"` or select Create new component option after `re-artifi` command.

This command need 2 argument

1.  **Component name** - component name should be small alphabets and without spaces, use (-) for spaces.
    
2.  **Component GIT URL** - GIT Remote Origin URL is required to setup submodules and configure mono repo.
    

  

![](https://lh5.googleusercontent.com/4XJnKFtyOtShyF700iyNcs3wxtTqeQ3GQwfI-DIwQaYHNihBtKN-8Awz3sHYTBg9w6T5HqMr4Occ4MaP9hqNAig7p8aiOrIJZ6xSQ-lNtEEWrvvTJbIdQPAEybKjbhgHMT1ncwUn)

  

This will configure new react project install all dependencies and setup rollup bundling process.

