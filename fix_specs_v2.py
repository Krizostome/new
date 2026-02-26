import os
import re

spec_files = []
for root, dirs, files in os.walk('src/app'):
    for file in files:
        if file.endswith('.spec.ts'):
            spec_files.append(os.path.join(root, file))

for spec in spec_files:
    with open(spec, 'r') as f:
        content = f.read()

    changed = False

    # Add common imports if missing
    imports_to_add = [
        ("ToastrModule", "ngx-toastr"),
        ("HttpClientTestingModule", "@angular/common/http/testing"),
        ("RouterTestingModule", "@angular/router/testing"),
        ("ReactiveFormsModule", "@angular/forms"),
        ("FormsModule", "@angular/forms"),
        ("NgbModule", "@ng-bootstrap/ng-bootstrap"),
        ("DataTablesModule", "angular-datatables"),
        ("GoogleMapsModule", "@angular/google-maps"),
        ("DatePipe", "@angular/common"),
        ("PaginationSlicePipe", "src/app/pipes/pagination-slice.pipe"),
        ("UrlPipe", "src/app/pipes/url.pipe"),
    ]

    for cls, path in imports_to_add:
        if cls in content: # If the class is used in the spec or needed
            pass # already there or will be added if needed

        # We'll just add them to the top and let TestBed use them if they are in the content
        # But wait, it's better to only add if they are likely needed.

    # Force add some essential ones
    essential = ["ToastrModule", "HttpClientTestingModule", "RouterTestingModule", "ReactiveFormsModule", "FormsModule", "NgbModule", "DataTablesModule"]
    for cls in essential:
        if cls not in content:
            path = next(p for c, p in imports_to_add if c == cls)
            content = f"import {{ {cls} }} from '{path}';\n" + content
            changed = True

    # Add pipes if they are mentioned in error logs (simplified)
    for cls in ["DatePipe", "PaginationSlicePipe", "UrlPipe", "GoogleMapsModule"]:
        if cls not in content:
            path = next(p for c, p in imports_to_add if c == cls)
            content = f"import {{ {cls} }} from '{path}';\n" + content
            changed = True

    # Update TestBed.configureTestingModule
    if 'imports:' in content:
        # Avoid duplicates
        current_imports = re.search(r'imports: \[([^\]]*)\]', content)
        if current_imports:
            imp_str = current_imports.group(1)
            for cls in essential + ["GoogleMapsModule"]:
                if cls not in imp_str:
                    content = content.replace(f"imports: [{imp_str}]", f"imports: [{imp_str}, {cls}.forRoot() if hasattr({cls}, 'forRoot') else {cls}]")
                    # Simplified:
                    content = content.replace(f"imports: [{imp_str}]", f"imports: [{imp_str}, {cls}]")
            changed = True

    # Fix for pipes in providers
    if 'providers:' in content:
        content = re.sub(r'providers: \[([^\]]*)\]', r'providers: [\1, DatePipe, PaginationSlicePipe, UrlPipe]', content)
        changed = True
    else:
        content = re.sub(r'TestBed\.configureTestingModule\(\{', r'TestBed.configureTestingModule({\n      providers: [DatePipe, PaginationSlicePipe, UrlPipe],', content)
        changed = True

    # Also add pipes to declarations if they are used in templates
    # This is getting complex, I'll just add them to declarations in all component specs
    if 'Component' in spec:
        if 'declarations:' in content:
            content = re.sub(r'declarations: \[([^\]]*)\]', r'declarations: [\1, PaginationSlicePipe, UrlPipe]', content)
        else:
             content = re.sub(r'TestBed\.configureTestingModule\(\{', r'TestBed.configureTestingModule({\n      declarations: [PaginationSlicePipe, UrlPipe],', content)
        changed = True

    if changed:
        # Final cleanup of double imports/dots/etc.
        content = content.replace('ToastrModule, ToastrModule', 'ToastrModule')
        content = content.replace('.forRoot().forRoot()', '.forRoot()')
        # ... this is still a bit rough but let's try
        with open(spec, 'w') as f:
            f.write(content)
