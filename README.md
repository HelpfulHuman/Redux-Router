## Getting Started

## Creating Your Router

```js
import Actions from "./actions";
import { createRouter } from "pure-redux-router";

const router = createRouter();

router
  .when("/todo/:todoId")
  .redirect(function ({ state }) {
    if (state.authToken === null) {
      return "/login";
    }
  })
  .use(function ({ params }, dispatch) {
    dispatch(Actions.getTodo(params.todoId));
    dispatch(Actions.getCommentsFor(params.todoId));
  });

router
  .when("/")
  .dispatch(function ({ query }) {
    return Actions.loadTodos(query);
  });

router.dispatch(function () {
  return { type: "ROUTE_NOT_FOUND" };
});
```

## Connecting Your Router to redux

```js
import { createStore, applyMiddleware } from "redux";
import { connectRouter } from "pure-redux-router";
import rootReducer from "./reducer";
import router from "./router";

var store = createStore(reducer, applyMiddleware(
  connectRouter(router)
));
```

## The Context Object