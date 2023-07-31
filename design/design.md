![](diagrams/images/createOrDeleteSubscriptions.png)
![](diagrams/images/setTimezone.png)
![](diagrams/images/scheduleWeather.png)
![](diagrams/images/sendWeather.png)

### DB schemas:

- **Users:**
  - id: uuid
  - chatId: number, unique
  - timezone: string


- **Subscriptions:**
  - id: uuid
  - subscriptionName: string
  - time: TIME, unique, index
  - userId: uuid


- **Locations:**
  - id: uuid
  - name: string
  - country: string
  - state: string
  - latitude: number
  - longitude: number
  - subscriptionId: uuid


### Used tools and packages:
- [Nest](https://nestjs.com/) - a Node.js framework
- [telegraph](https://www.npmjs.com/package/telegraf), 
[nestjs-telegraf](https://www.npmjs.com/package/nestjs-telegraf) -
creating bots and integration with NestJS application
- [TypeORM](https://www.npmjs.com/package/typeorm) - an Object-Relational Mapping (ORM) library for TypeScript and JavaScript
- [cron](https://www.npmjs.com/package/cron) - a tool allows to execute something on a schedule
- [axios](https://www.npmjs.com/package/axios) - HTTP client for the browser and node.js
- [date-fns](https://www.npmjs.com/package/date-fns), [date-fns-tz](https://www.npmjs.com/package/date-fns-tz) - a toolset for manipulating JavaScript dates in a browser & Node.js
- [timezone-support](https://www.npmjs.com/package/timezone-support) - time zone listing and date converting
