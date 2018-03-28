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
    return (tree, _context) => {
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
            schematics_1.template(Object.assign({}, options, { coreVersion,
                schematicsVersion, dot: '.', camelize: core_1.strings.camelize, dasherize: core_1.strings.dasherize })),
        ]);
        // Simply create a new schematic project.
        if (!collectionPath) {
            collectionPath = core_1.normalize('/' + options.name + '/src/collection.json');
            source = schematics_1.apply(schematics_1.url('./project-files'), [
                schematics_1.template(Object.assign({}, options, { coreVersion,
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
        ])(tree, context);
    };
}
exports.default = default_1;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZmFjdG9yeS5qcyIsInNvdXJjZVJvb3QiOiIuLyIsInNvdXJjZXMiOlsicGFja2FnZXMvc2NoZW1hdGljcy9zY2hlbWF0aWNzL2JsYW5rL2ZhY3RvcnkudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7QUFBQTs7Ozs7O0dBTUc7QUFDSCwrQ0FROEI7QUFDOUIsMkRBV29DO0FBQ3BDLDREQUEwRTtBQUkxRSxtQ0FDRSxRQUF3QixFQUN4QixJQUFtQixFQUNuQixZQUFvQixFQUNwQixLQUFnQixFQUNoQixNQUFNLEdBQUcsQ0FBQztJQUVWLE1BQU0sU0FBUyxHQUFHLElBQUksR0FBRyxJQUFJLEtBQUssQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBRXpELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDL0IsZ0JBQWdCO1FBQ2hCLE1BQU0sSUFBSSxHQUFHLElBQUksQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUM7UUFDekQsUUFBUSxDQUFDLFdBQVcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsRUFBRSxDQUFDLENBQUMsTUFBTSxFQUFFLEdBQUcsQ0FBQyxDQUFDO0lBQ3RGLENBQUM7SUFFRCxRQUFRLENBQUMsVUFBVSxDQUNqQixJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQ25CLElBQUk7VUFDRixJQUFJLFlBQVksTUFBTSxJQUFJLENBQUMsU0FBUyxDQUFDLEtBQUssRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxTQUFTLENBQUMsRUFBRTtVQUNoRixTQUFTLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBRSxDQUFD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Q0FBQyxPQUFPLENBQUMsSUFBSSxDQUFDO2FBQ2pDLENBQUM7U0FDSCxDQUFDLENBQUMsSUFBSSxFQUFFLE9BQU8sQ0FBQyxDQUFDO0lBQ3BCLENBQUMsQ0FBQztBQUNKLENBQUM7QUE1REQsNEJBNERDIiwic291cmNlc0NvbnRlbnQiOlsiLyoqXG4gKiBAbGljZW5zZVxuICogQ29weXJpZ2h0IEdvb2dsZSBJbmMuIEFsbCBSaWdodHMgUmVzZXJ2ZWQuXG4gKlxuICogVXNlIG9mIHRoaXMgc291cmNlIGNvZGUgaXMgZ292ZXJuZWQgYnkgYW4gTUlULXN0eWxlIGxpY2Vuc2UgdGhhdCBjYW4gYmVcbiAqIGZvdW5kIGluIHRoZSBMSUNFTlNFIGZpbGUgYXQgaHR0cHM6Ly9hbmd1bGFyLmlvL2xpY2Vuc2VcbiAqL1xuaW1wb3J0IHtcbiAgSnNvbkFzdE9iamVjdCxcbiAgSnNvbk9iamVjdCxcbiAgSnNvblZhbHVlLFxuICBQYXRoLFxuICBub3JtYWxpemUsXG4gIHBhcnNlSnNvbkFzdCxcbiAgc3RyaW5ncyxcbn0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L2NvcmUnO1xuaW1wb3J0IHtcbiAgUnVsZSxcbiAgU2NoZW1hdGljQ29udGV4dCxcbiAgVHJlZSxcbiAgVXBkYXRlUmVjb3JkZXIsXG4gIGFwcGx5LFxuICBjaGFpbixcbiAgbWVyZ2VXaXRoLFxuICBtb3ZlLFxuICB0ZW1wbGF0ZSxcbiAgdXJsLFxufSBmcm9tICdAYW5ndWxhci1kZXZraXQvc2NoZW1hdGljcyc7XG5pbXBvcnQgeyBOb2RlUGFja2FnZUluc3RhbGxUYXNrIH0gZnJvbSAnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvdGFza3MnO1xuaW1wb3J0IHsgU2NoZW1hIH0gZnJvbSAnLi9zY2hlbWEnO1xuXG5cbmZ1bmN0aW9uIGFwcGVuZFByb3BlcnR5SW5Bc3RPYmplY3QoXG4gIHJlY29yZGVyOiBVcGRhdGVSZWNvcmRlcixcbiAgbm9kZTogSnNvbkFzdE9iamVjdCxcbiAgcHJvcGVydHlOYW1lOiBzdHJpbmcsXG4gIHZhbHVlOiBKc29uVmFsdWUsXG4gIGluZGVudCA9IDQsXG4pIHtcbiAgY29uc3QgaW5kZW50U3RyID0gJ1xcbicgKyBuZXcgQXJyYXkoaW5kZW50ICsgMSkuam9pbignICcpO1xuXG4gIGlmIChub2RlLnByb3BlcnRpZXMubGVuZ3RoID4gMCkge1xuICAgIC8vIEluc2VydCBjb21tYS5cbiAgICBjb25zdCBsYXN0ID0gbm9kZS5wcm9wZXJ0aWVzW25vZGUucHJvcGVydGllcy5sZW5ndGggLSAxXTtcbiAgICByZWNvcmRlci5pbnNlcnRSaWdodChsYXN0LnN0YXJ0Lm9mZnNldCArIGxhc3QudGV4dC5yZXBsYWNlKC9cXHMrJC8sICcnKS5sZW5ndGgsICcsJyk7XG4gIH1cblxuICByZWNvcmRlci5pbnNlcnRMZWZ0KFxuICAgIG5vZGUuZW5kLm9mZnNldCAtIDEsXG4gICAgJyAgJ1xuICAgICsgYFwiJHtwcm9wZXJ0eU5hbWV9XCI6ICR7SlNPTi5zdHJpbmdpZnkodmFsdWUsIG51bGwsIDIpLnJlcGxhY2UoL1xcbi9nLCBpbmRlbnRTdHIpfWBcbiAgICArIGluZGVudFN0ci5zbGljZSgwLCAtMiksXG4gICk7XG59XG5cbmZ1bmN0aW9uIGFkZFNjaGVtYXRpY1RvQ29sbGVjdGlvbkpzb24oXG4gIGNvbGxlY3Rpb25QYXRoOiBQYXRoLFxuICBzY2hlbWF0aWNOYW1lOiBzdHJpbmcsXG4gIGRlc2NyaXB0aW9uOiBKc29uT2JqZWN0LFxuKTogUnVsZSB7XG4gIHJldHVybiAodHJlZTogVHJlZSwgX2NvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBjb25zdCBjb2xsZWN0aW9uSnNvbkNvbnRlbnQgPSB0cmVlLnJlYWQoY29sbGVjdGlvblBhdGgpO1xuICAgIGlmICghY29sbGVjdGlvbkpzb25Db250ZW50KSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29sbGVjdGlvbiBwYXRoOiAnICsgY29sbGVjdGlvblBhdGgpO1xuICAgIH1cbiAgICBjb25zdCBjb2xsZWN0aW9uSnNvbkFzdCA9IHBhcnNlSnNvbkFzdChjb2xsZWN0aW9uSnNvbkNvbnRlbnQudG9TdHJpbmcoJ3V0Zi04JykpO1xuICAgIGlmIChjb2xsZWN0aW9uSnNvbkFzdC5raW5kICE9PSAnb2JqZWN0Jykge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbGxlY3Rpb24gY29udGVudC4nKTtcbiAgICB9XG5cbiAgICBmb3IgKGNvbnN0IHByb3BlcnR5IG9mIGNvbGxlY3Rpb25Kc29uQXN0LnByb3BlcnRpZXMpIHtcbiAgICAgIGlmIChwcm9wZXJ0eS5rZXkudmFsdWUgPT0gJ3NjaGVtYXRpY3MnKSB7XG4gICAgICAgIGlmIChwcm9wZXJ0eS52YWx1ZS5raW5kICE9PSAnb2JqZWN0Jykge1xuICAgICAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb2xsZWN0aW9uLmpzb247IHNjaGVtYXRpY3MgbmVlZHMgdG8gYmUgYW4gb2JqZWN0LicpO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgcmVjb3JkZXIgPSB0cmVlLmJlZ2luVXBkYXRlKGNvbGxlY3Rpb25QYXRoKTtcbiAgICAgICAgYXBwZW5kUHJvcGVydHlJbkFzdE9iamVjdChyZWNvcmRlciwgcHJvcGVydHkudmFsdWUsIHNjaGVtYXRpY05hbWUsIGRlc2NyaXB0aW9uKTtcbiAgICAgICAgdHJlZS5jb21taXRVcGRhdGUocmVjb3JkZXIpO1xuXG4gICAgICAgIHJldHVybiB0cmVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgdGhlIFwic2NoZW1hdGljc1wiIHByb3BlcnR5IGluIGNvbGxlY3Rpb24uanNvbi4nKTtcbiAgfTtcbn1cblxuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiAob3B0aW9uczogU2NoZW1hKTogUnVsZSB7XG4gIGNvbnN0IHNjaGVtYXRpY3NWZXJzaW9uID0gcmVxdWlyZSgnQGFuZ3VsYXItZGV2a2l0L3NjaGVtYXRpY3MvcGFja2FnZS5qc29uJykudmVyc2lvbjtcbiAgY29uc3QgY29yZVZlcnNpb24gPSByZXF1aXJlKCdAYW5ndWxhci1kZXZraXQvY29yZS9wYWNrYWdlLmpzb24nKS52ZXJzaW9uO1xuXG4gIC8vIFZlcmlmeSBpZiB3ZSBuZWVkIHRvIGNyZWF0ZSBhIGZ1bGwgcHJvamVjdCwgb3IganVzdCBhZGQgYSBuZXcgc2NoZW1hdGljLlxuICByZXR1cm4gKHRyZWU6IFRyZWUsIGNvbnRleHQ6IFNjaGVtYXRpY0NvbnRleHQpID0+IHtcbiAgICBsZXQgY29sbGVjdGlvblBhdGg6IFBhdGggfCB1bmRlZmluZWQ7XG4gICAgdHJ5IHtcbiAgICAgIGNvbnN0IHBhY2thZ2VKc29uQ29udGVudCA9IHRyZWUucmVhZCgnL3BhY2thZ2UuanNvbicpO1xuICAgICAgaWYgKHBhY2thZ2VKc29uQ29udGVudCkge1xuICAgICAgICBjb25zdCBwYWNrYWdlSnNvbiA9IEpTT04ucGFyc2UocGFja2FnZUpzb25Db250ZW50LnRvU3RyaW5nKCd1dGYtOCcpKTtcbiAgICAgICAgaWYgKCdzY2hlbWF0aWNzJyBpbiBwYWNrYWdlSnNvbikge1xuICAgICAgICAgIGNvbnN0IHAgPSBub3JtYWxpemUocGFja2FnZUpzb25bJ3NjaGVtYXRpY3MnXSk7XG4gICAgICAgICAgaWYgKHRyZWUuZXhpc3RzKHApKSB7XG4gICAgICAgICAgICBjb2xsZWN0aW9uUGF0aCA9IHA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBjYXRjaCAoXykge1xuICAgIH1cblxuICAgIGxldCBzb3VyY2UgPSBhcHBseSh1cmwoJy4vc2NoZW1hdGljLWZpbGVzJyksIFtcbiAgICAgICAgdGVtcGxhdGUoe1xuICAgICAgICAgIC4uLm9wdGlvbnMgYXMgb2JqZWN0LFxuICAgICAgICAgIGNvcmVWZXJzaW9uLFxuICAgICAgICAgIHNjaGVtYXRpY3NWZXJzaW9uLFxuICAgICAgICAgIGRvdDogJy4nLFxuICAgICAgICAgIGNhbWVsaXplOiBzdHJpbmdzLmNhbWVsaXplLFxuICAgICAgICAgIGRhc2hlcml6ZTogc3RyaW5ncy5kYXNoZXJpemUsXG4gICAgICAgIH0pLFxuICAgICAgXSk7XG5cbiAgICAvLyBTaW1wbHkgY3JlYXRlIGEgbmV3IHNjaGVtYXRpYyBwcm9qZWN0LlxuICAgIGlmICghY29sbGVjdGlvblBhdGgpIHtcbiAgICAgIGNvbGxlY3Rpb25QYXRoID0gbm9ybWFsaXplKCcvJyArIG9wdGlvbnMubmFtZSArICcvc3JjL2NvbGxlY3Rpb24uanNvbicpO1xuICAgICAgc291cmNlID0gYXBwbHkodXJsKCcuL3Byb2plY3QtZmlsZXMnKSwgW1xuICAgICAgICB0ZW1wbGF0ZSh7XG4gICAgICAgICAgLi4ub3B0aW9ucyBhcyBvYmplY3QsXG4gICAgICAgICAgY29yZVZlcnNpb24sXG4gICAgICAgICAgc2NoZW1hdGljc1ZlcnNpb24sXG4gICAgICAgICAgZG90OiAnLicsXG4gICAgICAgICAgY2FtZWxpemU6IHN0cmluZ3MuY2FtZWxpemUsXG4gICAgICAgICAgZGFzaGVyaXplOiBzdHJpbmdzLmRhc2hlcml6ZSxcbiAgICAgICAgfSksXG4gICAgICAgIG1lcmdlV2l0aChzb3VyY2UpLFxuICAgICAgICBtb3ZlKG9wdGlvbnMubmFtZSksXG4gICAgICBdKTtcblxuICAgICAgY29udGV4dC5hZGRUYXNrKG5ldyBOb2RlUGFja2FnZUluc3RhbGxUYXNrKG9wdGlvbnMubmFtZSkpO1xuICAgIH1cblxuICAgIHJldHVybiBjaGFpbihbXG4gICAgICBtZXJnZVdpdGgoc291cmNlKSxcbiAgICAgIGFkZFNjaGVtYXRpY1RvQ29sbGVjdGlvbkpzb24oY29sbGVjdGlvblBhdGgsIHN0cmluZ3MuZGFzaGVyaXplKG9wdGlvbnMubmFtZSksIHtcbiAgICAgICAgZGVzY3JpcHRpb246ICdBIGJsYW5rIHNjaGVtYXRpYy4nLFxuICAgICAgICBmYWN0b3J5OiAnLi8nICsgc3RyaW5ncy5kYXNoZXJpemUob3B0aW9ucy5uYW1lKSArICcvaW5kZXgjJyArXG4gICAgICAgICAgc3RyaW5ncy5jYW1lbGl6ZShvcHRpb25zLm5hbWUpLFxuICAgICAgfSksXG4gICAgXSkodHJlZSwgY29udGV4dCk7XG4gIH07XG59XG4iXX0=