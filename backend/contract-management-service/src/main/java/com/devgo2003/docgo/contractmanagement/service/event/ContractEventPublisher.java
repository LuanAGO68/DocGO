package com.devgo2003.docgo.contractmanagement.service.event;

import org.springframework.context.ApplicationEventPublisher;
import org.springframework.stereotype.Component;

@Component
public class ContractEventPublisher {
    private final ApplicationEventPublisher applicationEventPublisher;

    public ContractEventPublisher(ApplicationEventPublisher applicationEventPublisher) {
        this.applicationEventPublisher = applicationEventPublisher;
    }

    public void publishEvent(ContractEventPayload eventPayload) {
        applicationEventPublisher.publishEvent(eventPayload);
    }
}