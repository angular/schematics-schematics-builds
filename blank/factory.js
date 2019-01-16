"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */
const core_1 = require("@angular-devkit/core");
const schematics_1 = require("@angular-devkit/schematics");
const tasks_1 = require("@angular-devkit/schematics/tasks");
function appendPropertyInAstObject(recorder, node, propertyName, value, indent = 4) {
    const indentStr = '\n' + new Array(indent + 1).join(' ');
    if (node.properties.length > 0) {
        // Insert comma.
        const last = node.properties[node.properties.length - 1];
        recorder.insertRight(last.start.offset + last.text.replace(/\s+$/, '').length, ',');
    }
    recorder.insertLeft(node.end.offset - 1, '  '
        + `"${propertyName}": ${JSON.stringify(value, null, 2).replace(/\n/g, indentStr)}`
        + indentStr.slice(0, -2));
}
function addSchematicToCollectionJson(collectionPath, schematicName, description) {
    return (tree) => {
        const collectionJsonContent = tree.read(collectionPath);
        if (!collectionJsonContent) {
            throw new Error('Invalid collection path: ' + collectionPath);
        }
        const collectionJsonAst = core_1.parseJsonAst(collectionJsonContent.toString('utf-8'));
        if (collectionJsonAst.kind !== 'object') {
            throw new Error('Invalid collection content.');
        }
        for (const property of collectionJsonAst.properties) {
            if (property.key.value == 'schematics') {
                if (property.value.kind !== 'object') {
                    throw new Error('Invalid collection.json; schematics needs to be an object.');
                }
                const recorder = tree.beginUpdate(collectionPath);
                appendPropertyInAstObject(recorder, property.value, schematicName, description);
                tree.commitUpdate(recorder);
                return tree;
            }
        }
        throw new Error('Could not find the "schematics" property in collection.json.');
    };
}
function default_1(options) {
    const schematicsVersion = require('@angular-devkit/schematics/package.json').version;
    const coreVersion = require('@angular-devkit/core/package.json').version;
    // Verify if we need to create a full project, or just add a new schematic.
    return (tree, context) => {
        if (!options.name) {
            throw new schematics_1.SchematicsException('name option is required.');
        }
        let collectionPath;
        try {
            const packageJsonContent = tree.read('/package.json');
            if (packageJsonContent) {
                const packageJson = JSON.parse(packageJsonContent.toString('utf-8'));
                if ('schematics' in packageJson) {
                    const p = core_1.normalize(packageJson['schematics']);
                    if (tree.exists(p)) {
                        collectionPath = p;
                    }
                }
            }
        }
        catch (_) {
        }
        let source = schematics_1.apply(schematics_1.url('./schematic-files'), [
            schematics_1.applyTemplates(Object.assign({}, options, { coreVersion,
                schematicsVersion, dot: '.', camelize: core_1.strings.camelize, dasherize: core_1.strings.dasherize })),
        ]);
        // Simply create a new schematic project.
        if (!collectionPath) {
            collectionPath = core_1.normalize('/' + options.name + '/src/collection.json');
            source = schematics_1.apply(schematics_1.url('./project-files'), [
                schematics_1.applyTemplates(Object.assign({}, options, { coreVersion,
                    schematicsVersion, dot: '.', camelize: core_1.strings.camelize, dasherize: core_1.strings.dasherize })),
                schematics_1.mergeWith(source),
                schematics_1.move(options.name),
            ]);
            context.addTask(new tasks_1.NodePackageInstallTask(options.name));
        }
        return schematics_1.chain([
            schematics_1.mergeWith(source),
            addSchematicToCollectionJson(collectionPath, core_1.strings.dasherize(options.name), {
                description: 'A blank schematic.',
                factory: './' + core_1.strings.dasherize(options.name) + '/index#' +
                    core_1.strings.camelize(options.name),
            }),
        ]);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9zY2hlbWF0aWNzL2JsYW5rL2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FROEI7QUFDOUIsMkRBWW9DO0FBQ3BDLDREQUEwRTtBQUkxRSxTQUFTLHlCQUF5QixDQUNoQyxRQUF3QixFQUN4QixJQUFtQixFQUNuQixZQUFvQixFQUNwQixLQUFnQixFQUNoQixNQUFNLEdBQUcsQ0FBQztJQUVWLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXpELElBQUksSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxFQUFFO1FBQzlCLGdCQUFnQjtRQUNoQixNQUFNLElBQUksR0FBRyxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDO1FBQ3pELFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDLE1BQU0sRUFBRSxHQUFHLENBQUMsQ0FBQztLQUNyRjtJQUVELFFBQVEsQ0FBQyxVQUFVLENBQ2pCLElBQUksQ0FBQyxHQUFHLENBQUMsTUFBTSxHQUFHLENBQUMsRUFDbkIsSUFBSTtVQUNGLElBQUksWUFBWSxNQUFNLElBQUksQ0FBQyxTQUFTLENBQUMsS0FBSyxFQUFFLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxFQUFFLFNBQVMsQ0FBQyxFQUFFO1VBQ2hGLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxFQUFFLENBQUMsQ0FBQyxDQUFDLENB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UUFDekMsSUFBSSxDQUFDLGNBQWMsRUFBRTtZQUNuQixjQUFjLEdBQUcsZ0JBQVMsQ0FBQyxHQUFHLEdBQUcsT0FBTyxDQUFDLElBQUksR0FBRyxzQkFBc0IsQ0FBQyxDQUFDO1lBQ3hFLE1BQU0sR0FBRyxrQkFBSyxDQUFDLGdCQUFHLENBQUMsaUJBQWlCLENBQUMsRUFBRTtnQkFDckMsMkJBQWMsbUJBQ1QsT0FBaUIsSUFDcEIsV0FBVztvQkFDWCxpQkFBaUIsRUFDakIsR0FBRyxFQUFFLEdBQUcsRUFDUixRQUFRLEVBQUUsY0FBTyxDQUFDLFFBQVEsRUFDMUIsU0FBUyxFQUFFLGNBQU8sQ0FBQyxTQUFTLElBQzVCO2dCQUNGLHNCQUFTLENBQUMsTUFBTSxDQUFDO2dCQUNqQixpQkFBSSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7YUFDbkIsQ0FBQyxDQUFDO1lBRUgsT0FBTyxDQUFDLE9BQU8sQ0FBQyxJQUFJLDhCQUFzQixDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO1NBQzNEO1FBRUQsT0FBTyxrQkFBSyxDQUFDO1lBQ1gsc0JBQVMsQ0FBQyxNQUFNLENBQUM7WUFDakIsNEJBQTRCLENBQUMsY0FBYyxFQUFFLGNBQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxFQUFFO2dCQUM1RSxXQUFXLEVBQUUsb0JBQW9CO2dCQUNqQyxPQUFPLEVBQUUsSUFBSSxHQUFHLGNBQU8sQ0FBQyxTQUFTLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxHQUFHLFNBQVM7b0JBQ3pELGNBQU8sQ0FBQyxRQUFRLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQzthQUNqQyxDQUFDO1NBQ0gsQ0FBQyxDQUFDO0lBQ0wsQ0FBQyxDQUFDO0FBQ0osQ0FBQztBQWhFRCw0QkFnRUMiLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIEBsaWNlbnNlXG4gKiBDb3B5cmlnaHQgR29vZ2xlIEluYy4gQWxsIFJpZ2h0cyBSZXNlcnZlZC5cbiAqXG4gKiBVc2Ugb2YgdGhpcyBzb3VyY2UgY29kZSBpcyBnb3Zlcm5lZCBieSBhbiBNSVQtc3R5bGUgbGljZW5zZSB0aGF0IGNhbiBiZVxuICogZm91bmQgaW4gdGhlIExJQ0VOU0UgZmlsZSBhdCBodHRwczovL2FuZ3VsYXIuaW8vbGljZW5zZVxuICovXG5pbXBvcnQge1xuICBKc29uQXN0T2JqZWN0LFxuICBKc29uT2JqZWN0LFxuICBKc29uVmFsdWUsXG4gIFBhdGgsXG4gIG5vcm1hbGl6ZSxcbiAgcGFyc2VKc29uQXN0LFxuICBzdHJpbmdzLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvY29yZSc7XG5pbXBvcnQge1xuICBSdWxlLFxuICBTY2hlbWF0aWNDb250ZXh0LFxuICBTY2hlbWF0aWNzRXhjZXB0aW9uLFxuICBUcmVlLFxuICBVcGRhdGVSZWNvcmRlcixcbiAgYXBwbHksXG4gIGFwcGx5VGVtcGxhdGVzLFxuICBjaGFpbixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICB1cmwsXG59IGZyb20gJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzJztcbmltcG9ydCB7IE5vZGVQYWNrYWdlSW5zdGFsbFRhc2sgfSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcy90YXNrcyc7XG5pbXBvcnQgeyBTY2hlbWEgfSBmcm9tICcuL3NjaGVtYSc7XG5cblxuZnVuY3Rpb24gYXBwZW5kUHJvcGVydHlJbkFzdE9iamVjdChcbiAgcmVjb3JkZXI6IFVwZGF0ZVJlY29yZGVyLFxuICBub2RlOiBKc29uQXN0T2JqZWN0LFxuICBwcm9wZXJ0eU5hbWU6IHN0cmluZyxcbiAgdmFsdWU6IEpzb25WYWx1ZSxcbiAgaW5kZW50ID0gNCxcbikge1xuICBjb25zdCBpbmRlbnRTdHIgPSAnXFxuJyArIG5ldyBBcnJheShpbmRlbnQgKyAxKS5qb2luKCcgJyk7XG5cbiAgaWYgKG5vZGUucHJvcGVydGllcy5sZW5ndGggPiAwKSB7XG4gICAgLy8gSW5zZXJ0IGNvbW1hLlxuICAgIGNvbnN0IGxhc3QgPSBub2RlLnByb3BlcnRpZXNbbm9kZS5wcm9wZXJ0aWVzLmxlbmd0aCAtIDFdO1xuICAgIHJlY29yZGVyLmluc2VydFJpZ2h0KGxhc3Quc3RhcnQub2Zmc2V0ICsgbGFzdC50ZXh0LnJlcGxhY2UoL1xccyskLywgJycpLmxlbmd0aCwgJywnKTtcbiAgfVxuXG4gIHJlY29yZGVyLmluc2VydExlZnQoXG4gICAgbm9kZS5lbmQub2Zmc2V0IC0gMSxcbiAgICAnICAnXG4gICAgKyBgXCIke3Byb3BlcnR5TmFtZX1cIjogJHtKU09OLnN0cmluZ2lmeSh2YWx1ZSwgbnVsbCwgMikucmVwbGFjZSgvXFxuL2csIGluZGVudFN0cil9YFxuICAgICsgaW5kZW50U3RyLnNsaWNlKDAsIC0yKSxcbiAgKTtcbn1cblxuZnVuY3Rpb24gYWRkU2NoZW1hdGljVG9Db2xsZWN0aW9uSnNvbihcbiAgY29sbGVjdGlvblBhdGg6IFBhdGgsXG4gIHNjaGVtYXRpY05hbWU6IHN0cmluZyxcbiAgZGVzY3JpcHRpb246IEpzb25PYmplY3QsXG4pOiBSdWxlIHtcbiAgcmV0dXJuICh0cmVlOiBUcmVlKSA9PiB7XG4gICAgY29uc3QgY29sbGVjdGlvbkpzb25Db250ZW50ID0gdHJlZS5yZWFkKGNvbGxlY3Rpb25QYXRoKTtcbiAgICBpZiAoIWNvbGxlY3Rpb25Kc29uQ29udGVudCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbGxlY3Rpb24gcGF0aDogJyArIGNvbGxlY3Rpb25QYXRoKTtcbiAgICB9XG4gICAgY29uc3QgY29sbGVjdGlvbkpzb25Bc3QgPSBwYXJzZUpzb25Bc3QoY29sbGVjdGlvbkpzb25Db250ZW50LnRvU3RyaW5nKCd1dGYtOCcpKTtcbiAgICBpZiAoY29sbGVjdGlvbkpzb25Bc3Qua2luZCAhPT0gJ29iamVjdCcpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xsZWN0aW9uIGNvbnRlbnQuJyk7XG4gICAgfVxuXG4gICAgZm9yIChjb25zdCBwcm9wZXJ0eSBvZiBjb2xsZWN0aW9uSnNvbkFzdC5wcm9wZXJ0aWVzKSB7XG4gICAgICBpZiAocHJvcGVydHkua2V5LnZhbHVlID09ICdzY2hlbWF0aWNzJykge1xuICAgICAgICBpZiAocHJvcGVydHkudmFsdWUua2luZCAhPT0gJ29iamVjdCcpIHtcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sbGVjdGlvbi5qc29uOyBzY2hlbWF0aWNzIG5lZWRzIHRvIGJlIGFuIG9iamVjdC4nKTtcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IHJlY29yZGVyID0gdHJlZS5iZWdpblVwZGF0ZShjb2xsZWN0aW9uUGF0aCk7XG4gICAgICAgIGFwcGVuZFByb3BlcnR5SW5Bc3RPYmplY3QocmVjb3JkZXIsIHByb3BlcnR5LnZhbHVlLCBzY2hlbWF0aWNOYW1lLCBkZXNjcmlwdGlvbik7XG4gICAgICAgIHRyZWUuY29tbWl0VXBkYXRlKHJlY29yZGVyKTtcblxuICAgICAgICByZXR1cm4gdHJlZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB0aHJvdyBuZXcgRXJyb3IoJ0NvdWxkIG5vdCBmaW5kIHRoZSBcInNjaGVtYXRpY3NcIiBwcm9wZXJ0eSBpbiBjb2xsZWN0aW9uLmpzb24uJyk7XG4gIH07XG59XG5cblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gKG9wdGlvbnM6IFNjaGVtYSk6IFJ1bGUge1xuICBjb25zdCBzY2hlbWF0aWNzVmVyc2lvbiA9IHJlcXVpcmUoJ0Bhbmd1bGFyLWRldmtpdC9zY2hlbWF0aWNzL3BhY2thZ2UuanNvbicpLnZlcnNpb247XG4gIGNvbnN0IGNvcmVWZXJzaW9uID0gcmVxdWlyZSgnQGFuZ3VsYXItZGV2a2l0L2NvcmUvcGFja2FnZS5qc29uJykudmVyc2lvbjtcblxuICAvLyBWZXJpZnkgaWYgd2UgbmVlZCB0byBjcmVhdGUgYSBmdWxsIHByb2plY3QsIG9yIGp1c3QgYWRkIGEgbmV3IHNjaGVtYXRpYy5cbiAgcmV0dXJuICh0cmVlOiBUcmVlLCBjb250ZXh0OiBTY2hlbWF0aWNDb250ZXh0KSA9PiB7XG4gICAgaWYgKCFvcHRpb25zLm5hbWUpIHtcbiAgICAgIHRocm93IG5ldyBTY2hlbWF0aWNzRXhjZXB0aW9uKCduYW1lIG9wdGlvbiBpcyByZXF1aXJlZC4nKTtcbiAgICB9XG5cbiAgICBsZXQgY29sbGVjdGlvblBhdGg6IFBhdGggfCB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uQ29udGVudCA9IHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpO1xuICAgICAgaWYgKHBhY2thZ2VKc29uQ29udGVudCkge1xuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UocGFja2FnZUpzb25Db250ZW50LnRvU3RyaW5nKCd1dGYtOCcpKTtcbiAgICAgICAgaWYgKCdzY2hlbWF0aWNzJyBpbiBwYWNrYWdlSnNvbikge1xuICAgICAgICAgIGNvbnN0IHAgPSBub3JtYWxpemUocGFja2FnZUpzb25bJ3NjaGVtYXRpY3MnXSk7XG4gICAgICAgICAgaWYgKHRyZWUuZXhpc3RzKHApKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uUGF0aCA9IHA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoXykge1xuICAgIH1cblxuICAgIGxldCBzb3VyY2UgPSBhcHBseSh1cmwoJy4vc2NoZW1hdGljLWZpbGVzJyksIFtcbiAgICAgICAgYXBwbHlUZW1wbGF0ZXMoe1xuICAgICAgICAgIC4uLm9wdGlvbnMgYXMgb2JqZWN0LFxuICAgICAgICAgIGNvcmVWZXJzaW9uLFxuICAgICAgICAgIHNjaGVtYXRpY3NWZXJzaW9uLFxuICAgICAgICAgIGRvdDogJy4nLFxuICAgICAgICAgIGNhbWVsaXplOiBzdHJpbmdzLmNhbWVsaXplLFxuICAgICAgICAgIGRhc2hlcml6ZTogc3RyaW5ncy5kYXNoZXJpemUsXG4gICAgICAgIH0pLFxuICAgICAgXSk7XG5cbiAgICAvLyBTaW1wbHkgY3JlYXRlIGEgbmV3IHNjaGVtYXRpYyBwcm9qZWN0LlxuICAgIGlmICghY29sbGVjdGlvblBhdGgpIHtcbiAgICAgIGNvbGxlY3Rpb25QYXRoID0gbm9ybWFsaXplKCcvJyArIG9wdGlvbnMubmFtZSArICcvc3JjL2NvbGxlY3Rpb24uanNvbicpO1xuICAgICAgc291cmNlID0gYXBwbHkodXJsKCcuL3Byb2plY3QtZmlsZXMnKSwgW1xuICAgICAgICBhcHBseVRlbXBsYXRlcyh7XG4gICAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgICAgY29yZVZlcnNpb24sXG4gICAgICAgICAgc2NoZW1hdGljc1ZlcnNpb24sXG4gICAgICAgICAgZG90OiAnLicsXG4gICAgICAgICAgY2FtZWxpemU6IHN0cmluZ3MuY2FtZWxpemUsXG4gICAgICAgICAgZGFzaGVyaXplOiBzdHJpbmdzLmRhc2hlcml6ZSxcbiAgICAgICAgfSksXG4gICAgICAgIG1lcmdlV2l0aChzb3VyY2UpLFxuICAgICAgICBtb3ZlKG9wdGlvbnMubmFtZSksXG4gICAgICBdKTtcblxuICAgICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKG9wdGlvbnMubmFtZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBtZXJnZVdpdGgoc291cmNlKSxcbiAgICAgIGFkZFNjaGVtYXRpY1RvQ29sbGVjdGlvbkpzb24oY29sbGVjdGlvblBhdGgsIHN0cmluZ3MuZGFzaGVyaXplKG9wdGlvbnMubmFtZSksIHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdBIGJsYW5rIHNjaGVtYXRpYy4nLFxuICAgICAgICBmYWN0b3J5OiAnLi8nICsgc3RyaW5ncy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvaW5kZXgjJyArXG4gICAgICAgICAgc3RyaW5ncy5jYW1lbGl6ZShvcHRpb25zLm5hbWUpLFxuICAgICAgfSksXG4gICAgXSk7XG4gIH07XG59XG4iXX0=