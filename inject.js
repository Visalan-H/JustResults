if (typeof angular !== "undefined") {
  try {
    const id = angular
      .element(document.body)
      .injector()
      .get("SharedService")
      .getLoginDetails().Student[0].StuID;

    // Create and dispatch a custom event carrying the Angular ID
    const event = new CustomEvent("AngularDataEvent", { detail: { id } });
    document.dispatchEvent(event);
  } catch (err) {
    console.error("Error accessing Angular data:", err);
  }
}
