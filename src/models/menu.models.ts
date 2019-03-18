

export class Menu {
    title: string;
    icon: string;
    right_icon: string;
    sub: MenuItem[] = []

    constructor(title: string, icon: string, right_icon){
        this.title = title
        this.icon = icon
        this.right_icon = right_icon
    }
}

export class MenuItem{
    sub_title: string
    component: any
    badge_value ?: string

    constructor(sub_title: string, component : any, badge_value?: string){
        this.sub_title = sub_title
        this.component = component
        if(badge_value)
        this.badge_value = badge_value
    }
}

