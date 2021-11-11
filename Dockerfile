FROM node:16

WORKDIR /usr/src/app

RUN curl --compressed -o- -L https://yarnpkg.com/install.sh | bash
RUN export PATH="$HOME/.yarn/bin:$HOME/.config/yarn/global/node_modules/.bin:$PATH"

EXPOSE 5000
