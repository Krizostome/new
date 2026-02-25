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

    # Add imports if missing
    if 'TestBed' in content:
        if 'ToastrModule' not in content:
            content = "import { ToastrModule } from 'ngx-toastr';\n" + content
            changed = True
        if 'HttpClientTestingModule' not in content:
            content = "import { HttpClientTestingModule } from '@angular/common/http/testing';\n" + content
            changed = True
        if 'RouterTestingModule' not in content:
            content = "import { RouterTestingModule } from '@angular/router/testing';\n" + content
            changed = True

        # Add to TestBed.configureTestingModule
        # Look for imports: [] or add it
        if 'imports:' in content:
            content = re.sub(r'imports: \[([^\]]*)\]', r'imports: [\1, ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule]', content)
            changed = True
        else:
            content = re.sub(r'TestBed\.configureTestingModule\(\{', r'TestBed.configureTestingModule({\n      imports: [ToastrModule.forRoot(), HttpClientTestingModule, RouterTestingModule],', content)
            changed = True

    if changed:
        # Clean up commas
        content = content.replace('[,', '[')
        with open(spec, 'w') as f:
            f.write(content)
