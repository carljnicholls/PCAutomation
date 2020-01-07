export interface PushbulletPush {
    active: boolean,
    body: string;
    created: string,
    direction: string, //incoming
    dismissed: boolean, //true
    iden: string,
    modified: string,
    receiver_email: string,
    receiver_email_normalized: string,
    receiver_iden: string, 
    sender_email: string,
    sender_email_normalized: string,
    sender_iden: string,    
    sender_name: string, // IFTT
    title: string,
    type: string, // note

    // seen in response but not docs 
    client_iden: string, 
    
}