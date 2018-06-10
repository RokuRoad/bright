import { ASTVisitor } from './ASTVisitor';
import { parse, RokuBRSParser } from './Parser';
import { ALL_TOKENS } from './Tokens';
import { visitorKeys } from './VisitorKeys';
declare const ast: (source: any) => any;
export { RokuBRSParser, ASTVisitor, ALL_TOKENS, parse, ast, visitorKeys };
