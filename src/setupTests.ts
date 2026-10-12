import "@testing-library/jest-dom";
import { TextDecoder, TextEncoder } from "util";

// react-router 7 expects these web globals; jsdom under Jest 27 lacks them.
Object.assign(global, { TextEncoder, TextDecoder });
