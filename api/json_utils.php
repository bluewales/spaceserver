<?php
/**
 * Indents a flat JSON string to make it more human-readable.
 *
 * @param string $json The original JSON string to process.
 *
 * @return string Indented version of the original JSON string.
 */
function indent($json) {
  $result = '';
      $level = 0;
      $in_quotes = false;
      $in_escape = false;
      $ends_line_level = NULL;
      $json_length = strlen( $json );

      for( $i = 0; $i < $json_length; $i++ ) {
          $char = $json[$i];
          $new_line_level = NULL;
          $post = "";
          if( $ends_line_level !== NULL ) {
              $new_line_level = $ends_line_level;
              $ends_line_level = NULL;
          }
          if ( $in_escape ) {
              $in_escape = false;
          } else if( $char === '"' ) {
              $in_quotes = !$in_quotes;
          } else if( ! $in_quotes ) {
              switch( $char ) {
                  case '}': case ']':
                      $level--;
                      $ends_line_level = NULL;
                      $new_line_level = $level;
                      break;

                  case '{': case '[':
                      $level++;
                  case ',':
                      $ends_line_level = $level;
                      break;

                  case ':':
                      $post = " ";
                      break;

                  case " ": case "\t": case "\n": case "\r":
                      $char = "";
                      $ends_line_level = $new_line_level;
                      $new_line_level = NULL;
                      break;
              }
          } else if ( $char === '\\' ) {
              $in_escape = true;
          }
          if( $new_line_level !== NULL ) {
              $result .= "\n".str_repeat( "  ", $new_line_level );
          }
          $result .= $char.$post;
      }

      return $result;
  }


function pretty_json_from_array($array, $pretty=120, $indent="") {
  $assoc = isAssoc($array);

  $next_indent = "  ".$indent;
  $new_line = "\n";

  $json = json_encode($array);
  if(strlen($json) < $pretty) return $json;

  $result = ($assoc?("{"):("[")).$new_line;

  $first = true;
  foreach ($array as $i => $value) {
    if(!$first) $result .= ",".$new_line;
    $first = false;

    $result .= $next_indent.($assoc?("\"".$i."\": "):"");
    if(is_array($value)) {
      $result .= pretty_json_from_array($value,$pretty,$next_indent);
    } else if(is_int($value)) {
      $result .= $value;
    } else {
      $result .= "\"".$value."\"";
    }
  }
  $result .= $new_line.$indent.($assoc?("}"):("]"));
  return $result;
}
?>
