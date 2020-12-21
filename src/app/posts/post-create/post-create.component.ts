import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { PostsService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Post } from '../post.model';
import { mimeType } from './mime-type.validator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.scss']
})

export class PostCreateComponent implements OnInit, OnDestroy {
  enteredTitle = '';
  enteredContent = '';
  private modes = {
    CREATE : 'CREATE',
    EDIT : 'EDIT',
  };
  private currentMode = this.modes.CREATE;
  private postId: string;
  private authStatusSub: Subscription;
  public post: Post;
  public isLoading = false;
  form: FormGroup;
  imagePreview: string | ArrayBuffer;

  constructor(
    public postsService: PostsService,
    public route: ActivatedRoute,
    private authService: AuthService
    ) {}

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener().subscribe(
      authStatus => {
        this.isLoading = false;
      }
    );
    this.form = new FormGroup({
      title: new FormControl(
        null,
        {validators: [Validators.required, Validators.minLength(3)]}
      ),
      content: new FormControl(
        null,
        {validators: [Validators.required]}
      ),
      image: new FormControl(null, {
        validators: Validators.required,
        asyncValidators: [mimeType]
      })
    });
    this.route.paramMap.subscribe((paramMap: ParamMap) => {
      if (paramMap.has('postId')) {
        this.currentMode = this.modes.EDIT;
        this.postId = paramMap.get('postId');
        this.isLoading = true;
        this.postsService.getPost(this.postId)
          .subscribe(postData => {
            this.post = {
              id: postData._id,
              title: postData.title,
              content: postData.content,
              imagePath: postData.imagePath,
              creator: postData.creator
            };
            this.form.setValue(
              {
                title: this.post.title,
                content: this.post.content,
                image: this.post.imagePath
              }
            );
            this.isLoading = false;
          });
      } else {
        this.currentMode = this.modes.CREATE;
        this.postId = null;
      }
    });
    console.log('this.currentMode ' + this.currentMode);
  }
  onSavePost() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    if (this.currentMode === this.modes.CREATE) {
      this.postsService.addPost(
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    } else {
      this.postsService.updatePost(
        this.postId,
        this.form.value.title,
        this.form.value.content,
        this.form.value.image
      );
    }
    this.form.reset();
  }

  onImagePciked(event: Event) {
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({image: file});
    this.form.get('image').updateValueAndValidity();
    console.log(file);
    console.log(this.form);
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreview = reader.result;
    };
    reader.readAsDataURL(file);
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }
}
