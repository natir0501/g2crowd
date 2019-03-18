import {Directive, ElementRef, OnInit, Renderer2} from '@angular/core';

@Directive({
    selector: '[touched-workaround]',
    host: {
        '(ionBlur)': 'onBlur()'
    }
})
export class TouchedWorkaroundDirective implements OnInit {
    
    private parent;
    
    constructor(private element: ElementRef, private renderer: Renderer2) {}
    
    ngOnInit() {
        this.parent = this.element.nativeElement.parentElement.parentElement.parentElement;
    }
    
    onBlur() {
        this.renderer.addClass(this.parent, 'ng-touched');
        this.renderer.removeClass(this.parent, 'ng-untouched');
    }
    
}