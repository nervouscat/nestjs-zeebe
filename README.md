<p align="center">
<b>Sponsored by:</b>
<br />
  <a href="http://precise.credit"><img src="https://precise.credit/wp-content/uploads/2021/06/precise-logo-light.png" alt="Sponsored by Precise" width="290" style="background-color: black; padding: 15px; border-radius: 10px" /></a>
</p>

[![Community extension badge](https://img.shields.io/badge/Community%20Extension-An%20open%20source%20community%20maintained%20project-FF4700)](https://github.com/camunda-community-hub/community) [![Lifecycle: Stable badge](https://img.shields.io/badge/Lifecycle-Stable-brightgreen)](https://github.com/Camunda-Community-Hub/community/blob/main/extension-lifecycle.md#stable-)



<p align="center">
  <a href="http://nestjs.com"><img src="https://nestjs.com/img/logo_text.svg" alt="Nest Logo" width="320" /></a>
</p>

# NestJS Zeebe Connector (Transport and Client) - Up-to-date
A zeebe transport and client for NestJS 7.x

Using the zeebe-node module and exposing it as a NestJS transport and module.

<p align="center">
  
[![Build Status](https://dansh.visualstudio.com/nestjs-zeebe/_apis/build/status/camunda-community-hub.nestjs-zeebe?branchName=master)](https://dansh.visualstudio.com/nestjs-zeebe/_build/latest?definitionId=2&branchName=master)

</p>


# Use version 2.x.x and above for Zeebe 1.x.x and above

## Install
    npm install nestjs-zeebe

## Basic usage


```ts
    // app.module.ts
    import { Module } from '@nestjs/common';
    import { AppController } from './app.controller';
    import { ZeebeModule, ZeebeServer } from 'nestjs-zeebe';

    @Module({
    imports: [ ZeebeModule.forRoot({ gatewayAddress: 'localhost:26500' })],
    controllers: [AppController],
    providers: [ZeebeServer],
    })
    export class AppModule {}
```

```ts
    // main.ts
    import { NestFactory } from '@nestjs/core';
    import { AppModule } from './app.module';
    import { ZeebeServer } from 'nestjs-zeebe';

    async function bootstrap() {
    const app = await NestFactory.create(AppModule);
    const microservice = app.connectMicroservice({
        strategy: app.get(ZeebeServer),
    });

    await app.startAllMicroservicesAsync();

    await app.listen(3000);
    }
    bootstrap();

```

```ts
    // app.controller.ts
    import { Controller, Get, Inject } from '@nestjs/common';
    import { AppService } from './app.service';
    import { ZBClient } from 'zeebe-node';
    import { ZEEBE_CONNECTION_PROVIDER, ZeebeWorker, ZeebeJob } from 'nestjs-zeebe';
    import {
    Ctx,
    Payload,
    } from '@nestjs/microservices';
    import { ZBClient, ZBWorker, ICustomHeaders, IInputVariables, IOutputVariables, CompleteFn } from 'zeebe-node';
    import { CreateProcessInstanceResponse } from 'zeebe-node/dist/lib/interfaces-grpc-1.0';

    @Controller()
    export class AppController {
        constructor(private readonly appService: AppService, @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient) {}

        // Use the client to create a new workflow instance
        @Get()
        getHello() : Promise<CreateProcessInstanceResponse> {
            return this.zbClient.createProcessInstance('order-process', { test: 1, or: 'romano'});
        }

        // Subscribe to events of type 'payment-service
        @ZeebeWorker('payment-service')
        paymentService(@Payload() job: ZeebeJob, @Ctx() context: { complete: CompleteFn<IOutputVariables>, worker: ZBWorker<IInputVariables, ICustomHeaders, IOutputVariables> }) {
            console.log('Payment-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            paymentService: 'Did my job',
            });

            // Task worker business logic goes here

            job.complete(updatedVariables);
        }

        // Subscribe to events of type 'inventory-service and create a worker with the options as passed below (zeebe-node ZBWorkerOptions)
        @ZeebeWorker('inventory-service', { maxJobsToActivate: 10, timeout: 300 })
        inventoryService(@Payload() job: ZeebeJob, @Ctx() context: { complete: CompleteFn<IOutputVariables>, worker: ZBWorker<IInputVariables, ICustomHeaders, IOutputVariables> }) {
            console.log('inventory-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            inventoryVar: 'Inventory donnnneee',
            });

            // Task worker business logic goes here
            //job.complete(updatedVariables);
            job.complete(updatedVariables);
        }
    }

```

## For v1.x.x

```ts
    // app.controller.ts
    import { Controller, Get, Inject } from '@nestjs/common';
    import { AppService } from './app.service';
    import { ZBClient } from 'zeebe-node';
    import { CreateWorkflowInstanceResponse, CompleteFn, Job } from 'zeebe-node/interfaces';
    import { ZEEBE_CONNECTION_PROVIDER, ZeebeWorker } from 'nestjs-zeebe';
    import {
        Ctx,
        Payload,
    } from '@nestjs/microservices';

    @Controller()
    export class AppController {
        constructor(private readonly appService: AppService, @Inject(ZEEBE_CONNECTION_PROVIDER) private readonly zbClient: ZBClient) {}

        // Use the client to create a new workflow instance
        @Get()
        getHello() : Promise<CreateWorkflowInstanceResponse> {
            return this.zbClient.createWorkflowInstance('order-process', { test: 1, or: 'romano'});
        }

        // Subscribe to events of type 'payment-service
        @ZeebeWorker('payment-service')
        paymentService(@Payload() job, @Ctx() fn: CompleteFn<any> {
            console.log('Payment-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            paymentService: 'Did my job',
            });

            // Task worker business logic goes here

            complete.success(updatedVariables);
        }

        // Subscribe to events of type 'inventory-service and create a worker with the options as passed below (zeebe-node ZBWorkerOptions)
        @ZeebeWorker('inventory-service', { maxJobsToActivate: 10, timeout: 300 })
        inventoryService(@Payload() job, @Ctx() fn: CompleteFn<any>) {
            console.log('inventory-service, Task variables', job.variables);
            let updatedVariables = Object.assign({}, job.variables, {
            inventoryVar: 'Inventory donnnneee',
            });

            // Task worker business logic goes here

            complete.success(updatedVariables);
        }
    }

```



<br /><br />
###### Hint:
For mac, you need to have xcode installed
```xcode-select --install```

<p align="center">
<b>Sponsored by:</b>
<br />
  <a href="http://precise.credit"><img src="https://precise.credit/wp-content/uploads/2021/06/precise-logo-light.png" alt="Sponsored by Precise" width="290" style="background-color: black; padding: 15px; border-radius: 10px" /></a>
</p>